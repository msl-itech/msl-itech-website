import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  OnInit,
} from '@angular/core';

@Component({
  selector: 'app-job',
  templateUrl: './job.component.html',
  styleUrl: './job.component.css',
})
export class JobComponent implements OnInit, AfterViewInit, OnDestroy {
  constructor(private el: ElementRef) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.adjustIframeHeight();
  }

  @HostListener('window:resize')
  onResize(): void {
    this.adjustIframeHeight();
  }

  ngOnDestroy(): void {
    // Pas besoin de supprimer l'écouteur car nous utilisons @HostListener
  }

  private adjustIframeHeight(): void {
    const headerHeight =
      document.querySelector('app-header')?.clientHeight || 0;
    const footerHeight =
      document.querySelector('app-footer')?.clientHeight || 0;
    const windowHeight = window.innerHeight;

    // Calculer la hauteur disponible
    const availableHeight = windowHeight - headerHeight - footerHeight - 40; // 40px pour les marges

    // Appliquer la hauteur à l'iframe container
    const iframeContainer =
      this.el.nativeElement.querySelector('.iframe-container');
    if (iframeContainer) {
      iframeContainer.style.height = `${availableHeight}px`;
    }
  }
}
