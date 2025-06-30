import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';

export interface ResponsiveImageConfig {
  mobile: string;
  tablet: string;
  desktop: string;
  alt: string;
  loading?: 'lazy' | 'eager';
}

@Injectable({
  providedIn: 'root',
})
export class ResponsiveImageService {
  constructor(private breakpointObserver: BreakpointObserver) {}

  /**
   * Retourne l'image appropriée selon le breakpoint actuel
   */
  getResponsiveImage(
    config: ResponsiveImageConfig
  ): Observable<{ src: string; alt: string; loading: 'lazy' | 'eager' }> {
    return this.breakpointObserver
      .observe([
        Breakpoints.XSmall, // < 600px (mobile)
        Breakpoints.Small, // 600-959px (tablet)
        Breakpoints.Medium, // 960-1279px (small desktop)
        Breakpoints.Large, // 1280-1919px (large desktop)
        Breakpoints.XLarge, // > 1920px (extra large)
      ])
      .pipe(
        map((result) => {
          let src: string;

          if (result.matches) {
            if (result.breakpoints[Breakpoints.XSmall]) {
              src = config.mobile;
            } else if (result.breakpoints[Breakpoints.Small]) {
              src = config.tablet;
            } else {
              src = config.desktop;
            }
          } else {
            src = config.desktop; // fallback
          }

          return {
            src,
            alt: config.alt,
            loading: config.loading || 'lazy',
          };
        })
      );
  }

  /**
   * Génère automatiquement les chemins d'images responsives basés sur un pattern
   */
  generateResponsiveConfig(
    basePath: string,
    alt: string,
    loading: 'lazy' | 'eager' = 'lazy'
  ): ResponsiveImageConfig {
    const pathParts = basePath.split('.');
    const extension = pathParts.pop();
    const basePathWithoutExt = pathParts.join('.');

    return {
      mobile: `${basePathWithoutExt}-mobile.${extension}`,
      tablet: `${basePathWithoutExt}-tablet.${extension}`,
      desktop: basePath, // Image originale pour desktop
      alt,
      loading,
    };
  }

  /**
   * Retourne les breakpoints actuels
   */
  getCurrentBreakpoint(): Observable<string> {
    return this.breakpointObserver
      .observe([
        Breakpoints.XSmall,
        Breakpoints.Small,
        Breakpoints.Medium,
        Breakpoints.Large,
        Breakpoints.XLarge,
      ])
      .pipe(
        map((result) => {
          if (result.breakpoints[Breakpoints.XSmall]) return 'mobile';
          if (result.breakpoints[Breakpoints.Small]) return 'tablet';
          if (result.breakpoints[Breakpoints.Medium]) return 'small-desktop';
          if (result.breakpoints[Breakpoints.Large]) return 'desktop';
          if (result.breakpoints[Breakpoints.XLarge]) return 'large-desktop';
          return 'desktop';
        })
      );
  }
}
