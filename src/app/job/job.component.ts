import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { iframeResizer } from 'iframe-resizer';

@Component({
  selector: 'app-job',
  templateUrl: './job.component.html',
  styleUrls: ['./job.component.css'],
})
export class JobComponent implements AfterViewInit, OnDestroy {
  @ViewChild('jobIframe', { static: true })
  iframeRef!: ElementRef<HTMLIFrameElement>;
  iframeResizer: any;
  isMobile: boolean = false;

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.checkDeviceType();
    this.reinitializeResizer();
  }

  ngAfterViewInit(): void {
    this.checkDeviceType();
    setTimeout(() => {
      this.initializeResizer();
    }, 100);
  }

  ngOnDestroy(): void {
    if (this.iframeResizer && this.iframeResizer.close) {
      this.iframeResizer.close();
    }
  }

  private checkDeviceType(): void {
    this.isMobile = window.innerWidth <= 768;
  }

  private reinitializeResizer(): void {
    if (this.iframeResizer && this.iframeResizer.close) {
      this.iframeResizer.close();
    }
    setTimeout(() => {
      this.initializeResizer();
    }, 100);
  }

  private initializeResizer(): void {
    try {
      console.log('Initialisation du iframe resizer...');

      // Configuration adaptée selon le type d'appareil
      const config: any = {
        log: false, // Désactiver les logs en production
        checkOrigin: false,
        heightCalculationMethod: this.isMobile
          ? 'documentElementOffset'
          : 'bodyOffset',
        sizeWidth: false,
        autoResize: true,
        scrolling: true,
        inPageLinks: true,
        resizeFrom: 'child',
        bodyMargin: 0,
        bodyPadding: 0,
        tolerance: 0,
        onResized: () => {
          console.log('iframe redimensionné');
        },
        onInit: () => {
          console.log('iframe initialisé');
          // Force un recalcul initial de la taille
          if (this.iframeRef && this.iframeRef.nativeElement) {
            this.iframeRef.nativeElement.style.height = '100%';
          }
        },
      };

      this.iframeResizer = iframeResizer(config, this.iframeRef.nativeElement);
    } catch (error) {
      console.error(
        "Erreur lors de l'initialisation du iframe resizer:",
        error
      );
    }
  }
}
