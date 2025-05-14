import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  OnInit,
  Renderer2,
} from '@angular/core';

@Component({
  selector: 'app-job',
  templateUrl: './job.component.html',
  styleUrl: './job.component.css',
})
export class JobComponent implements OnInit, AfterViewInit, OnDestroy {
  private iframeElement: HTMLIFrameElement | null = null;
  private isIframeLoaded = false;
  private isScrollingIframe = false;
  private isScrollingPage = false;

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.setupIframe();
  }

  @HostListener('window:resize')
  onResize(): void {
    this.setupIframe();
  }

  @HostListener('window:scroll', ['$event'])
  onWindowScroll(event: Event): void {
    // Éviter les boucles de défilement
    if (this.isScrollingIframe) return;

    this.isScrollingPage = true;
    setTimeout(() => {
      this.isScrollingPage = false;
    }, 100);
  }

  @HostListener('window:wheel', ['$event'])
  onWindowWheel(event: WheelEvent): void {
    if (!this.isIframeLoaded || !this.iframeElement || this.isScrollingIframe)
      return;

    // Déterminer si l'iframe est visible dans la fenêtre
    const rect = this.iframeElement.getBoundingClientRect();
    const isIframeVisible = rect.top < window.innerHeight && rect.bottom > 0;

    if (isIframeVisible) {
      // Si on est en bas de la page et qu'on défile vers le bas, laisser l'iframe prendre le relais
      if (
        event.deltaY > 0 &&
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 100
      ) {
        this.focusIframe();
      }

      // Si on est en haut de l'iframe et qu'on défile vers le haut, laisser la page prendre le relais
      if (event.deltaY < 0 && this.isAtTopOfIframe()) {
        // Laisser le défilement de la page se faire normalement
      } else if (rect.top <= 0 && rect.bottom >= window.innerHeight) {
        // L'iframe remplit la vue, lui donner la priorité
        if (!this.isScrollingPage) {
          event.preventDefault();
          this.scrollIframe(event.deltaY);
        }
      }
    }
  }

  ngOnDestroy(): void {
    // Nettoyer les écouteurs éventuels
  }

  private setupIframe(): void {
    this.iframeElement = this.el.nativeElement.querySelector('.odoo-iframe');

    if (this.iframeElement) {
      // Ajuster la hauteur minimale
      const viewportHeight = window.innerHeight;
      const minHeight = Math.max(800, viewportHeight * 0.9);
      this.renderer.setStyle(
        this.iframeElement,
        'min-height',
        `${minHeight}px`
      );

      // Attendre que l'iframe soit chargée
      this.iframeElement.onload = () => {
        this.isIframeLoaded = true;

        try {
          // Tenter de lier les événements de défilement de l'iframe
          this.setupIframeEvents();
        } catch (e) {
          console.log(
            "Impossible d'accéder au contenu de l'iframe (restrictions de sécurité):",
            e
          );
        }
      };
    }
  }

  private setupIframeEvents(): void {
    if (!this.iframeElement || !this.iframeElement.contentWindow) return;

    try {
      // Écouter les événements de défilement dans l'iframe
      this.iframeElement.contentWindow.addEventListener(
        'scroll',
        (e: Event) => {
          if (this.isScrollingPage) return;

          this.isScrollingIframe = true;
          setTimeout(() => {
            this.isScrollingIframe = false;
          }, 100);
        }
      );

      // Écouter les événements de la molette dans l'iframe
      this.iframeElement.contentWindow.addEventListener(
        'wheel',
        (e: WheelEvent) => {
          const target = e.target as HTMLElement;
          const doc = this.iframeElement?.contentDocument;

          if (!doc) return;

          // Si on défile vers le haut et qu'on est déjà tout en haut de l'iframe
          if (e.deltaY < 0 && doc.documentElement.scrollTop <= 0) {
            // Transférer le défilement à la page principale
            window.scrollBy(0, e.deltaY);
          }

          // Si on défile vers le bas et qu'on est en bas de l'iframe
          if (
            e.deltaY > 0 &&
            doc.documentElement.scrollTop + doc.documentElement.clientHeight >=
              doc.documentElement.scrollHeight - 5
          ) {
            // Transférer le défilement à la page principale
            window.scrollBy(0, e.deltaY);
          }
        }
      );
    } catch (e) {
      console.error("Erreur d'accès au contenu de l'iframe:", e);
    }
  }

  private isAtTopOfIframe(): boolean {
    try {
      if (!this.iframeElement || !this.iframeElement.contentDocument)
        return false;
      return this.iframeElement.contentDocument.documentElement.scrollTop <= 0;
    } catch (e) {
      return false;
    }
  }

  private scrollIframe(deltaY: number): void {
    try {
      if (!this.iframeElement || !this.iframeElement.contentWindow) return;
      this.iframeElement.contentWindow.scrollBy(0, deltaY);
    } catch (e) {
      console.error("Erreur lors du défilement de l'iframe:", e);
    }
  }

  private focusIframe(): void {
    if (this.iframeElement) {
      this.iframeElement.focus();
    }
  }
}
