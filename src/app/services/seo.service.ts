import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { Router, NavigationEnd } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { filter } from 'rxjs/operators';

export interface SEOConfig {
  title: string;
  description: string;
  image?: string;
  url?: string;
  type?: string;
  keywords?: string;
  author?: string;
}

@Injectable({
  providedIn: 'root'
})
export class SeoService {
  private defaultImage = 'https://www.msl-itech.com/assets/img/og-image.jpg';
  private siteName = 'MSL iTech';
  private baseUrl = 'https://www.msl-itech.com';

  constructor(
    private meta: Meta,
    private titleService: Title,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    // Mettre à jour les meta tags à chaque changement de route
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.updateCanonicalUrl();
    });
  }

  /**
   * Met à jour tous les meta tags SEO pour une page
   */
  updateMetaTags(config: SEOConfig): void {
    // Titre
    const fullTitle = config.title.includes(this.siteName)
      ? config.title
      : `${config.title} | ${this.siteName}`;

    this.titleService.setTitle(fullTitle);
    this.meta.updateTag({ name: 'title', content: fullTitle });

    // Description
    this.meta.updateTag({ name: 'description', content: config.description });

    // Keywords (optionnel)
    if (config.keywords) {
      this.meta.updateTag({ name: 'keywords', content: config.keywords });
    }

    // Author (optionnel)
    if (config.author) {
      this.meta.updateTag({ name: 'author', content: config.author });
    }

    // Open Graph
    this.meta.updateTag({ property: 'og:title', content: fullTitle });
    this.meta.updateTag({ property: 'og:description', content: config.description });
    this.meta.updateTag({ property: 'og:type', content: config.type || 'website' });
    this.meta.updateTag({
      property: 'og:image',
      content: config.image || this.defaultImage
    });

    if (config.url) {
      this.meta.updateTag({ property: 'og:url', content: this.baseUrl + config.url });
    }

    this.meta.updateTag({ property: 'og:site_name', content: this.siteName });
    this.meta.updateTag({ property: 'og:locale', content: 'fr_BE' });

    // Twitter Card
    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.meta.updateTag({ name: 'twitter:title', content: fullTitle });
    this.meta.updateTag({ name: 'twitter:description', content: config.description });
    this.meta.updateTag({
      name: 'twitter:image',
      content: config.image || this.defaultImage
    });

    // Robots
    this.meta.updateTag({
      name: 'robots',
      content: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'
    });
  }

  /**
   * Met à jour l'URL canonique
   */
  private updateCanonicalUrl(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const currentUrl = this.baseUrl + this.router.url.split('?')[0];

    // Supprimer l'ancienne balise canonical si elle existe
    const existingLink = document.querySelector('link[rel="canonical"]');
    if (existingLink) {
      existingLink.setAttribute('href', currentUrl);
    } else {
      // Créer une nouvelle balise canonical
      const link = document.createElement('link');
      link.setAttribute('rel', 'canonical');
      link.setAttribute('href', currentUrl);
      document.head.appendChild(link);
    }
  }

  /**
   * Ajoute un schema JSON-LD à la page
   */
  addJsonLdSchema(schema: any): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(schema);
    document.head.appendChild(script);
  }

  /**
   * Supprime tous les schemas JSON-LD existants
   */
  removeAllJsonLdSchemas(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const scripts = document.querySelectorAll('script[type="application/ld+json"]');
    scripts.forEach(script => {
      if (script.parentNode && !script.textContent?.includes('"@type": "Organization"')) {
        // Garder le schema Organization du index.html
        script.parentNode.removeChild(script);
      }
    });
  }

  /**
   * Génère le schema BreadcrumbList
   */
  generateBreadcrumbSchema(breadcrumbs: Array<{name: string, url: string}>): any {
    return {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": breadcrumbs.map((item, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "name": item.name,
        "item": this.baseUrl + item.url
      }))
    };
  }

  /**
   * Génère le schema Service
   */
  generateServiceSchema(serviceName: string, description: string): any {
    return {
      "@context": "https://schema.org",
      "@type": "Service",
      "serviceType": serviceName,
      "name": serviceName,
      "description": description,
      "provider": {
        "@type": "Organization",
        "name": this.siteName,
        "url": this.baseUrl
      },
      "areaServed": {
        "@type": "Country",
        "name": "Belgium"
      }
    };
  }

  /**
   * Génère le schema Article pour le blog
   */
  generateArticleSchema(article: {
    title: string,
    description: string,
    image: string,
    datePublished: string,
    dateModified: string,
    author: string
  }): any {
    return {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": article.title,
      "description": article.description,
      "image": article.image,
      "datePublished": article.datePublished,
      "dateModified": article.dateModified,
      "author": {
        "@type": "Person",
        "name": article.author
      },
      "publisher": {
        "@type": "Organization",
        "name": this.siteName,
        "logo": {
          "@type": "ImageObject",
          "url": this.baseUrl + "/assets/img/logo.png"
        }
      }
    };
  }
}
