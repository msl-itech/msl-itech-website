import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { HeightCalculationMethod, iframeResizer } from 'iframe-resizer';

@Component({
  selector: 'app-job',
  templateUrl: './job.component.html',
  styleUrls: ['./job.component.css'],
})
export class JobComponent implements AfterViewInit, OnDestroy {
  @ViewChild('jobIframe', { static: true })
  iframeRef!: ElementRef<HTMLIFrameElement>;
  iframeResizer: any;

  constructor(private renderer: Renderer2) {}

  ngAfterViewInit(): void {
    this.initializeResizer();
    this.setupIframeEvents();
  }

  ngOnDestroy(): void {
    if (this.iframeResizer?.close) {
      this.iframeResizer.close();
    }
  }

  private setupIframeEvents(): void {
    const iframe = this.iframeRef.nativeElement;

    // Gestion du focus sur l'iframe
    this.renderer.listen(iframe, 'mouseenter', () => {
      if (window.innerWidth <= 768) {
        // Seulement sur mobile
        this.renderer.addClass(document.body, 'iframe-focused');
      }
    });

    this.renderer.listen(iframe, 'mouseleave', () => {
      this.renderer.removeClass(document.body, 'iframe-focused');
    });

    // Pour les appareils tactiles
    this.renderer.listen(iframe, 'touchstart', () => {
      this.renderer.addClass(document.body, 'iframe-focused');
    });

    this.renderer.listen(iframe, 'touchend', () => {
      setTimeout(() => {
        this.renderer.removeClass(document.body, 'iframe-focused');
      }, 500);
    });
  }
  private initializeResizer(): void {
    try {
      const config = {
        log: false,
        checkOrigin: false,
        heightCalculationMethod: 'bodyScroll' as HeightCalculationMethod,
        sizeWidth: false,
        autoResize: true,
        scrolling: true,
        bodyMargin: 0,
        bodyPadding: 0,
        tolerance: 0,
        onResized: (data: any) => {
          this.iframeRef.nativeElement.style.height = `${data.height}px`;
        },
        onInit: () => {
          this.iframeRef.nativeElement.style.visibility = 'visible';
        },
      };

      this.iframeResizer = iframeResizer(config, this.iframeRef.nativeElement);
    } catch (error) {
      console.error('Erreur iframe resizer:', error);
    }
  }
}
