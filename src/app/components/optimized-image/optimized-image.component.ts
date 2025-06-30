import { Component, Input, OnInit } from '@angular/core';
import {
  ResponsiveImageConfig,
  ResponsiveImageService,
} from '../../services/responsive-image.service';

@Component({
  selector: 'app-optimized-image',
  template: `
    <img
      [appResponsiveImage]="imageConfig"
      [fallbackSrc]="fallbackSrc"
      [class]="imageClass"
      [style]="imageStyle"
      [ngStyle]="customStyles"
    />
  `,
  styleUrls: ['./optimized-image.component.css'],
  standalone: false,
})
export class OptimizedImageComponent implements OnInit {
  @Input() src!: string;
  @Input() alt!: string;
  @Input() loading: 'lazy' | 'eager' = 'lazy';
  @Input() fallbackSrc?: string;
  @Input() imageClass?: string;
  @Input() imageStyle?: string;
  @Input() customStyles?: { [key: string]: any };
  @Input() useAutoGeneration: boolean = true;
  @Input() customConfig?: ResponsiveImageConfig;

  imageConfig!: ResponsiveImageConfig;

  constructor(private responsiveImageService: ResponsiveImageService) {}

  ngOnInit() {
    if (this.customConfig) {
      this.imageConfig = this.customConfig;
    } else if (this.useAutoGeneration) {
      this.imageConfig = this.responsiveImageService.generateResponsiveConfig(
        this.src,
        this.alt,
        this.loading
      );
    } else {
      // Configuration de base sans responsive
      this.imageConfig = {
        mobile: this.src,
        tablet: this.src,
        desktop: this.src,
        alt: this.alt,
        loading: this.loading,
      };
    }

    // Définir le fallback si non fourni
    if (!this.fallbackSrc) {
      this.fallbackSrc = this.src;
    }
  }
}
