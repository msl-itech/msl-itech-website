import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'app-job',
  templateUrl: './job.component.html',
  styleUrl: './job.component.css',
})
export class JobComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('jobIframe') iframeElement!: ElementRef;
  private scrollListener: any;
  private wheelListener: any;
  private iframeLoaded = false;
  private isScrollingParent = false;
  private lastScrollTime = 0;

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngOnInit(): void {
    // Ajouter un écouteur d'événement de défilement à la fenêtre principale
    this.wheelListener = this.handleWheelEvent.bind(this);
    window.addEventListener('wheel', this.wheelListener, { passive: false });

    // Ajouter un écouteur pour le défilement de la page principale
    window.addEventListener('scroll', () => {
      this.lastScrollTime = Date.now();
    });
  }

  ngAfterViewInit(): void {
    this.setupIframe();
  }

  @HostListener('window:resize')
  onResize(): void {
    // Réinitialiser l'iframe lors du redimensionnement
    this.setupIframe();
  }

  ngOnDestroy(): void {
    // Nettoyer les écouteurs d'événements
    if (this.scrollListener) {
      window.removeEventListener('message', this.scrollListener);
    }
    if (this.wheelListener) {
      window.removeEventListener('wheel', this.wheelListener);
    }
  }

  private handleWheelEvent(event: WheelEvent): void {
    const iframe = this.iframeElement?.nativeElement;
    if (!iframe || !this.iframeLoaded) return;

    // Si nous sommes en train de faire défiler la page principale, ne pas intercepter
    if (this.isScrollingParent) {
      if (Date.now() - this.lastScrollTime > 300) {
        this.isScrollingParent = false;
      } else {
        return;
      }
    }

    const iframeRect = iframe.getBoundingClientRect();

    // Vérifier si l'iframe est visible à l'écran
    const iframeVisible =
      iframeRect.top < window.innerHeight && iframeRect.bottom > 0;

    if (!iframeVisible) return;

    const isMouseOverIframe =
      event.clientX >= iframeRect.left &&
      event.clientX <= iframeRect.right &&
      event.clientY >= iframeRect.top &&
      event.clientY <= iframeRect.bottom;

    // Amélioration pour le défilement vers le haut: vérifier si l'iframe est au sommet de la vue
    const iframeAtTopOfView = iframeRect.top <= 0 && iframeRect.top > -100;

    if (isMouseOverIframe || (iframeAtTopOfView && event.deltaY < 0)) {
      // Vérifier si l'utilisateur est en haut ou en bas de l'iframe
      try {
        if (iframe.contentWindow) {
          const iframeDoc = iframe.contentWindow.document;
          const scrollHeight = iframeDoc.documentElement.scrollHeight;
          const scrollTop = iframeDoc.documentElement.scrollTop;
          const clientHeight = iframeDoc.documentElement.clientHeight;

          // Si on est au sommet de l'iframe et que l'utilisateur continue à défiler vers le haut
          if (scrollTop <= 5 && event.deltaY < 0) {
            // Permettre le défilement normal de la page principale
            this.isScrollingParent = true;
            return;
          }

          // Si on est au bas de l'iframe et que l'utilisateur continue à défiler vers le bas
          if (
            scrollTop + clientHeight >= scrollHeight - 10 &&
            event.deltaY > 0
          ) {
            // Permettre le défilement normal de la page principale
            this.isScrollingParent = true;
            return;
          }

          // Si on est à l'intérieur de l'iframe, empêcher le défilement de la page principale
          event.preventDefault();
          event.stopPropagation();

          // Faire défiler l'iframe manuellement avec une accélération
          const scrollAmount = event.deltaY * 1.2; // Accélération légère
          iframeDoc.documentElement.scrollTop += scrollAmount;
        }
      } catch (e) {
        console.log("Erreur lors de l'accès au contenu de l'iframe:", e);
      }
    }
  }

  private injectCommunicationScript(iframe: HTMLIFrameElement): void {
    try {
      if (iframe.contentWindow && iframe.contentDocument) {
        // Script pour permettre la communication entre l'iframe et la page parente
        const script = iframe.contentDocument.createElement('script');
        script.text = `
          // Envoyer la hauteur du contenu à la page parente
          function sendHeight() {
            const height = Math.max(
              document.body.scrollHeight,
              document.documentElement.scrollHeight
            );
            window.parent.postMessage({ type: 'iframeHeight', height: height }, '*');
          }
          
          // Envoyer la hauteur lorsque le contenu change
          window.addEventListener('load', sendHeight);
          window.addEventListener('resize', sendHeight);
          
          // Observer les changements de taille du contenu
          const resizeObserver = new ResizeObserver(() => {
            sendHeight();
          });
          resizeObserver.observe(document.body);
          
          // Intercepter les événements de défilement
          document.addEventListener('wheel', function(event) {
            const scrollTop = document.documentElement.scrollTop;
            const scrollHeight = document.documentElement.scrollHeight;
            const clientHeight = document.documentElement.clientHeight;
            
            // Si on est en haut ou en bas, propager l'événement à la page parente
            if ((scrollTop <= 5 && event.deltaY < 0) || 
                (scrollTop + clientHeight >= scrollHeight - 10 && event.deltaY > 0)) {
              window.parent.postMessage({
                type: 'scrollBoundary',
                direction: event.deltaY < 0 ? 'top' : 'bottom',
                deltaY: event.deltaY
              }, '*');
              
              // Empêcher le défilement dans l'iframe à ses limites
              if ((scrollTop <= 0 && event.deltaY < 0) || 
                  (scrollTop + clientHeight >= scrollHeight && event.deltaY > 0)) {
                event.preventDefault();
              }
            }
          }, { passive: false });
        `;

        // Ajouter le script au document de l'iframe
        iframe.contentDocument.head.appendChild(script);
      }
    } catch (e) {
      console.log("Impossible d'injecter le script dans l'iframe:", e);
    }
  }

  private setupIframe(): void {
    const iframe = this.iframeElement?.nativeElement;
    if (!iframe) return;

    // Attendre que l'iframe soit chargé
    iframe.onload = () => {
      this.iframeLoaded = true;

      // Définir une hauteur minimale appropriée
      const viewportHeight = window.innerHeight;
      this.renderer.setStyle(
        iframe,
        'min-height',
        `${viewportHeight * 0.85}px`
      );

      // Essayer d'injecter le script de communication
      this.injectCommunicationScript(iframe);
    };

    // Écouter les messages de l'iframe
    this.scrollListener = (event: MessageEvent) => {
      if (!event.data) return;

      if (event.data.type === 'iframeHeight') {
        // Ajuster la hauteur de l'iframe en fonction du contenu
        this.renderer.setStyle(iframe, 'height', `${event.data.height}px`);
      } else if (event.data.type === 'scrollBoundary') {
        // L'iframe a atteint une limite de défilement, permettre le défilement de la page principale
        this.isScrollingParent = true;

        if (event.data.direction === 'top') {
          // Défilement vers le haut plus agressif pour éviter le blocage
          window.scrollBy({
            top: Math.min(-100, event.data.deltaY * 1.5),
            behavior: 'smooth',
          });
        } else if (event.data.direction === 'bottom') {
          // Défilement vers le bas
          window.scrollBy({
            top: Math.max(100, event.data.deltaY * 1.5),
            behavior: 'smooth',
          });
        }
      }
    };
    window.addEventListener('message', this.scrollListener);
  }
}
