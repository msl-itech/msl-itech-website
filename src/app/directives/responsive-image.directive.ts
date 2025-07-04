import {
  Directive,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  Renderer2,
} from '@angular/core';
import { Subscription } from 'rxjs';
import {
  ResponsiveImageConfig,
  ResponsiveImageService,
} from '../services/responsive-image.service';

@Directive({
  selector: '[appResponsiveImage]',
  standalone: false,
})
export class ResponsiveImageDirective implements OnInit, OnDestroy {
  @Input() appResponsiveImage!: ResponsiveImageConfig;
  @Input() fallbackSrc?: string;

  private subscription: Subscription = new Subscription();

  constructor(
    private el: ElementRef<HTMLImageElement>,
    private renderer: Renderer2,
    private responsiveImageService: ResponsiveImageService
  ) {}

  ngOnInit() {
    if (!this.appResponsiveImage) {
      console.error(
        'ResponsiveImageDirective: appResponsiveImage input is required'
      );
      return;
    }

    // S'abonner aux changements de breakpoint
    this.subscription = this.responsiveImageService
      .getResponsiveImage(this.appResponsiveImage)
      .subscribe({
        next: (imageData) => {
          this.updateImage(
            imageData.src,
            imageData.alt,
            imageData.loading,
            imageData.fetchpriority
          );
        },
        error: (error) => {
          console.error('Error loading responsive image:', error);
          if (this.fallbackSrc) {
            this.updateImage(
              this.fallbackSrc,
              this.appResponsiveImage.alt,
              'lazy'
            );
          }
        },
      });

    // Gérer les erreurs de chargement d'image
    this.renderer.listen(this.el.nativeElement, 'error', () => {
      if (this.fallbackSrc && this.el.nativeElement.src !== this.fallbackSrc) {
        console.warn(
          `Failed to load image: ${this.el.nativeElement.src}, using fallback`
        );
        this.updateImage(
          this.fallbackSrc,
          this.appResponsiveImage.alt,
          'lazy',
          undefined
        );
      }
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  private updateImage(
    src: string,
    alt: string,
    loading: 'lazy' | 'eager',
    fetchpriority?: 'high' | 'low' | 'auto'
  ) {
    this.renderer.setAttribute(this.el.nativeElement, 'src', src);
    this.renderer.setAttribute(this.el.nativeElement, 'alt', alt);
    this.renderer.setAttribute(this.el.nativeElement, 'loading', loading);

    // Ajouter fetchpriority si défini
    if (fetchpriority) {
      this.renderer.setAttribute(
        this.el.nativeElement,
        'fetchpriority',
        fetchpriority
      );
    }

    // Ajouter des classes pour le styling
    this.renderer.addClass(this.el.nativeElement, 'responsive-image');

    // Optimisations supplémentaires
    this.renderer.setAttribute(this.el.nativeElement, 'decoding', 'async');
  }
}
