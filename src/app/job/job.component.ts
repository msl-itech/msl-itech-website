import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  NgZone,
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
  private scrollingTimeout: any = null;
  private iframeTopPosition = 0;

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    private ngZone: NgZone
  ) {}

  ngOnInit(): void {
    // Sortir de la zone Angular pour éviter les cycles de détection de changements inutiles
    this.ngZone.runOutsideAngular(() => {
      // Ajouter un écouteur d'événement de défilement principal
      this.wheelListener = this.handleWheelEvent.bind(this);
      window.addEventListener('wheel', this.wheelListener, { passive: false });

      // Observer le défilement global
      window.addEventListener('scroll', () => {
        this.lastScrollTime = Date.now();
        this.isScrollingParent = true;

        // Réinitialiser le flag après un certain délai
        clearTimeout(this.scrollingTimeout);
        this.scrollingTimeout = setTimeout(() => {
          this.isScrollingParent = false;
          this.updateIframePosition();
        }, 400);
      });
    });
  }

  ngAfterViewInit(): void {
    this.setupIframe();
    // Initial position update
    setTimeout(() => this.updateIframePosition(), 500);
  }

  updateIframePosition(): void {
    const iframe = this.iframeElement?.nativeElement;
    if (iframe) {
      this.iframeTopPosition = iframe.getBoundingClientRect().top;
    }
  }

  @HostListener('window:resize')
  onResize(): void {
    // Réinitialiser l'iframe lors du redimensionnement
    this.setupIframe();
    this.updateIframePosition();
  }

  ngOnDestroy(): void {
    // Nettoyer les écouteurs d'événements
    if (this.scrollListener) {
      window.removeEventListener('message', this.scrollListener);
    }
    if (this.wheelListener) {
      window.removeEventListener('wheel', this.wheelListener);
    }
    if (this.scrollingTimeout) {
      clearTimeout(this.scrollingTimeout);
    }
  }

  private handleWheelEvent(event: WheelEvent): void {
    const iframe = this.iframeElement?.nativeElement;
    if (!iframe || !this.iframeLoaded) return;

    // Si nous sommes en train de faire défiler la page principale, ne pas intercepter
    if (this.isScrollingParent) {
      if (Date.now() - this.lastScrollTime > 350) {
        this.isScrollingParent = false;
        this.updateIframePosition();
      } else {
        return;
      }
    }

    const iframeRect = iframe.getBoundingClientRect();

    // Déterminer si nous sommes dans une zone d'influence de l'iframe (marge élargie)
    const iframeInfluenceZone =
      iframeRect.top < window.innerHeight + 100 && iframeRect.bottom > -100;

    if (!iframeInfluenceZone) return;

    // Vérifier si la souris est au-dessus de l'iframe
    const isMouseOverIframe =
      event.clientX >= iframeRect.left &&
      event.clientX <= iframeRect.right &&
      event.clientY >= iframeRect.top &&
      event.clientY <= iframeRect.bottom;

    // Vérifier si nous sommes proches des limites de l'iframe
    const iframeAtTopOfView = iframeRect.top <= 10 && iframeRect.top > -150;
    const iframeAtBottomOfView =
      iframeRect.bottom >= window.innerHeight - 10 &&
      iframeRect.bottom <= window.innerHeight + 150;

    // Zone d'influence pour le défilement
    const shouldInfluenceScroll =
      isMouseOverIframe ||
      (iframeAtTopOfView && event.deltaY < 0) ||
      (iframeAtBottomOfView && event.deltaY > 0);

    if (shouldInfluenceScroll) {
      try {
        if (iframe.contentWindow) {
          const iframeDoc = iframe.contentWindow.document;
          const scrollHeight = iframeDoc.documentElement.scrollHeight;
          const scrollTop = iframeDoc.documentElement.scrollTop;
          const clientHeight = iframeDoc.documentElement.clientHeight;

          // Marge de détection plus large pour les limites
          const isAtTop = scrollTop <= 20;
          const isAtBottom = scrollTop + clientHeight >= scrollHeight - 20;

          // Si on est au sommet de l'iframe et qu'on défile vers le haut
          if (isAtTop && event.deltaY < 0) {
            // Transition fluide vers la page principale
            this.isScrollingParent = true;
            // Propulser le défilement de façon plus agressive si en haut de l'iframe
            if (iframeRect.top <= 50) {
              window.scrollBy({
                top: Math.min(-150, event.deltaY * 3),
                behavior: 'smooth',
              });

              // Éviter que l'iframe ne traite cet événement
              event.preventDefault();
              event.stopPropagation();
            }
            return;
          }

          // Si on est au bas de l'iframe et qu'on défile vers le bas
          if (isAtBottom && event.deltaY > 0) {
            // Transition fluide vers la page principale
            this.isScrollingParent = true;

            // Propulser le défilement si en bas de l'iframe
            if (iframeRect.bottom >= window.innerHeight - 50) {
              window.scrollBy({
                top: Math.max(150, event.deltaY * 3),
                behavior: 'smooth',
              });

              // Éviter que l'iframe ne traite cet événement
              event.preventDefault();
              event.stopPropagation();
            }
            return;
          }

          // Si on est à l'intérieur de l'iframe et pas aux limites
          if (isMouseOverIframe) {
            // Empêcher le défilement de la page principale
            event.preventDefault();
            event.stopPropagation();

            // Faire défiler l'iframe avec une accélération pour un défilement plus naturel
            const scrollAmount = event.deltaY * 1.5;
            iframeDoc.documentElement.scrollTop += scrollAmount;
          }
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
          // Augmenter la priorité du script
          script.setAttribute('async', 'false');
          script.setAttribute('defer', 'false');
          
          // Envoyer la hauteur du contenu à la page parente
          function sendHeight() {
            const height = Math.max(
              document.body.scrollHeight,
              document.documentElement.scrollHeight
            );
            window.parent.postMessage({ type: 'iframeHeight', height: height }, '*');
          }
          
          // Envoyer la position de défilement
          function sendScrollPosition() {
            const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
            const scrollHeight = document.documentElement.scrollHeight;
            const clientHeight = document.documentElement.clientHeight;
            
            window.parent.postMessage({ 
              type: 'iframeScroll', 
              scrollTop: scrollTop,
              scrollHeight: scrollHeight,
              clientHeight: clientHeight
            }, '*');
          }
          
          // Envoyer la hauteur lorsque le contenu change
          window.addEventListener('load', function() {
            sendHeight();
            // Envoyer aussi après un court délai pour s'assurer que tout est chargé
            setTimeout(sendHeight, 500);
            setTimeout(sendHeight, 1500);
          });
          
          window.addEventListener('resize', sendHeight);
          
          // Observer les changements de taille du contenu
          if (window.ResizeObserver) {
            const resizeObserver = new ResizeObserver(function() {
              sendHeight();
            });
            
            // Observer à la fois le corps et l'élément racine
            if (document.body) resizeObserver.observe(document.body);
            if (document.documentElement) resizeObserver.observe(document.documentElement);
            
            // Observer également les conteneurs principaux s'ils existent
            document.querySelectorAll('.main-container, main, #main').forEach(function(el) {
              resizeObserver.observe(el);
            });
          }
          
          // Intercepter les événements de défilement
          let lastScrollSent = 0;
          document.addEventListener('scroll', function() {
            // Limiter le nombre de messages envoyés
            const now = Date.now();
            if (now - lastScrollSent > 100) {
              lastScrollSent = now;
              sendScrollPosition();
              
              // Détecter si on est aux limites du défilement
              const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
              const scrollHeight = document.documentElement.scrollHeight;
              const clientHeight = document.documentElement.clientHeight;
              
              if (scrollTop <= 20) {
                window.parent.postMessage({ type: 'scrollBoundary', direction: 'top' }, '*');
              } else if (scrollTop + clientHeight >= scrollHeight - 20) {
                window.parent.postMessage({ type: 'scrollBoundary', direction: 'bottom' }, '*');
              }
            }
          }, { passive: true });
          
          // Intercepter les événements de roue pour une meilleure détection des limites
          document.addEventListener('wheel', function(event) {
            const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
            const scrollHeight = document.documentElement.scrollHeight;
            const clientHeight = document.documentElement.clientHeight;
            
            // Si on est aux limites et qu'on essaie de continuer dans cette direction
            if ((scrollTop <= 10 && event.deltaY < 0) || 
                (scrollTop + clientHeight >= scrollHeight - 10 && event.deltaY > 0)) {
              
              window.parent.postMessage({
                type: 'scrollBoundary',
                direction: event.deltaY < 0 ? 'top' : 'bottom',
                deltaY: event.deltaY
              }, '*');
              
              // Si on est vraiment à la limite, empêcher le défilement dans l'iframe
              if ((scrollTop === 0 && event.deltaY < 0) || 
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
      this.ngZone.run(() => {
        this.iframeLoaded = true;
      });

      // Définir une hauteur minimale appropriée
      const viewportHeight = window.innerHeight;
      this.renderer.setStyle(iframe, 'min-height', `${viewportHeight * 0.9}px`);

      // Essayer d'injecter le script de communication
      setTimeout(() => {
        this.injectCommunicationScript(iframe);
        this.updateIframePosition();
      }, 300);
    };

    // Écouter les messages de l'iframe
    this.scrollListener = (event: MessageEvent) => {
      if (!event.data) return;

      if (event.data.type === 'iframeHeight') {
        // Ajuster la hauteur de l'iframe en fonction du contenu
        const height = Math.max(event.data.height, window.innerHeight * 0.9);
        this.renderer.setStyle(iframe, 'height', `${height}px`);
      } else if (event.data.type === 'scrollBoundary') {
        // L'iframe a atteint une limite de défilement
        this.isScrollingParent = true;

        if (event.data.direction === 'top') {
          // Défilement vers le haut plus agressif pour éviter le blocage
          const scrollAmount = event.data.deltaY
            ? Math.min(-120, event.data.deltaY * 3)
            : -120;
          window.scrollBy({
            top: scrollAmount,
            behavior: 'smooth',
          });
        } else if (event.data.direction === 'bottom') {
          // Défilement vers le bas
          const scrollAmount = event.data.deltaY
            ? Math.max(120, event.data.deltaY * 3)
            : 120;
          window.scrollBy({
            top: scrollAmount,
            behavior: 'smooth',
          });
        }

        // Réinitialiser après un délai
        clearTimeout(this.scrollingTimeout);
        this.scrollingTimeout = setTimeout(() => {
          this.isScrollingParent = false;
          this.updateIframePosition();
        }, 500);
      } else if (event.data.type === 'iframeScroll') {
        // Mettre à jour les informations de position de défilement interne de l'iframe
        // Utile pour une détection plus précise
      }
    };
    this.ngZone.runOutsideAngular(() => {
      window.addEventListener('message', this.scrollListener);
    });
  }
}
