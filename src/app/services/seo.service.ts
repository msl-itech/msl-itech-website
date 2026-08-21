import { Injectable, Inject, PLATFORM_ID, RendererFactory2, Renderer2 } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { Router, NavigationEnd } from '@angular/router';
import { isPlatformBrowser, DOCUMENT } from '@angular/common';
import { filter } from 'rxjs/operators';

export interface SEOConfig {
  title: string;
  description: string;
  image?: string;
  url?: string;
  type?: string;
  keywords?: string;
  author?: string;
  article?: {
    publishedTime: string;
    modifiedTime?: string;
    author: string;
    section: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class SeoService {
  private defaultImage = 'https://www.msl-itech.com/assets/img/og-image.jpg';
  private siteName = 'MSL iTech';
  private baseUrl = 'https://www.msl-itech.com';
  private renderer: Renderer2;

  constructor(
    private meta: Meta,
    private titleService: Title,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object,
    @Inject(DOCUMENT) private document: Document,
    rendererFactory: RendererFactory2
  ) {
    this.renderer = rendererFactory.createRenderer(null, null);

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

    // Article Open Graph (blog uniquement)
    if (config.article) {
      this.meta.updateTag({ property: 'og:type', content: 'article' });
      this.meta.updateTag({ property: 'article:published_time', content: config.article.publishedTime });
      this.meta.updateTag({ property: 'article:author', content: config.article.author });
      this.meta.updateTag({ property: 'article:section', content: config.article.section });
      if (config.article.modifiedTime) {
        this.meta.updateTag({ property: 'article:modified_time', content: config.article.modifiedTime });
      }
    }
  }

  /**
   * Met à jour l'URL canonique
   */
  private updateCanonicalUrl(): void {
    const currentUrl = this.baseUrl + this.router.url.split('?')[0];

    // Supprimer l'ancienne balise canonical si elle existe
    const existingLink = this.document.querySelector('link[rel="canonical"]');
    if (existingLink) {
      this.renderer.setAttribute(existingLink, 'href', currentUrl);
    } else {
      // Créer une nouvelle balise canonical via Renderer2 (SSR-safe)
      const link = this.renderer.createElement('link');
      this.renderer.setAttribute(link, 'rel', 'canonical');
      this.renderer.setAttribute(link, 'href', currentUrl);
      this.renderer.appendChild(this.document.head, link);
    }
  }

  /**
   * Ajoute un schema JSON-LD à la page
   */
  addJsonLdSchema(schema: any): void {
    // Fonctionne côté serveur et browser via Renderer2 + DOCUMENT
    const script = this.renderer.createElement('script');
    this.renderer.setAttribute(script, 'type', 'application/ld+json');
    const text = this.renderer.createText(JSON.stringify(schema));
    this.renderer.appendChild(script, text);
    this.renderer.appendChild(this.document.head, script);
  }

  /**
   * Supprime tous les schemas JSON-LD injectés dynamiquement (browser uniquement).
   * Conserve le schema Organization statique défini dans index.html.
   */
  removeAllJsonLdSchemas(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const scripts = this.document.querySelectorAll('script[type="application/ld+json"]');
    scripts.forEach(script => {
      try {
        const data = JSON.parse(script.textContent || '{}');
        const type = data['@type'];
        // Garder uniquement le schema Organization du index.html
        const isOrg = type === 'Organization' || (Array.isArray(type) && type.includes('Organization'));
        if (!isOrg && script.parentNode) {
          script.parentNode.removeChild(script);
        }
      } catch {
        // Si le JSON est invalide, supprimer le script par sécurité
        if (script.parentNode) script.parentNode.removeChild(script);
      }
    });
  }

  /**
   * Génère le schema BreadcrumbList
   */
  generateBreadcrumbSchema(breadcrumbs: Array<{ name: string, url: string }>): any {
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
   * Génère le schema Article pour le blog (version complète avec mainEntityOfPage)
   */
  generateArticleSchema(article: {
    title: string,
    description: string,
    image: string,
    datePublished: string,
    dateModified: string,
    author: string,
    url?: string
  }): any {
    const pageUrl = article.url ? this.baseUrl + article.url : this.baseUrl + this.router.url;
    return {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": article.title,
      "description": article.description,
      "image": {
        "@type": "ImageObject",
        "url": article.image,
        "width": 1200,
        "height": 630
      },
      "datePublished": article.datePublished,
      "dateModified": article.dateModified,
      "mainEntityOfPage": { "@type": "WebPage", "@id": pageUrl },
      "author": {
        "@type": "Person",
        "name": article.author
      },
      "publisher": {
        "@type": "Organization",
        "name": this.siteName,
        "@id": this.baseUrl + "/#organization",
        "logo": {
          "@type": "ImageObject",
          "url": this.baseUrl + "/assets/img/logo.png"
        }
      }
    };
  }

  /**
   * Génère le schema FAQPage pour les accordéons Q/R
   * Pattern GEO/AEO — cité par ChatGPT, Perplexity, Google AI Overviews
   */
  generateFaqSchema(faqs: Array<{ question: string; answer: string }>): any {
    return {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": faqs.map(f => ({
        "@type": "Question",
        "name": f.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": f.answer
        }
      }))
    };
  }

  /**
   * Génère le schema WebApplication pour les outils interactifs (démo, questionnaire)
   */
  generateWebApplicationSchema(opts: {
    name: string;
    description: string;
    url: string;
    applicationCategory?: string;
    price?: string;
  }): any {
    return {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": opts.name,
      "description": opts.description,
      "url": this.baseUrl + opts.url,
      "applicationCategory": opts.applicationCategory || "BusinessApplication",
      "operatingSystem": "Web",
      "offers": {
        "@type": "Offer",
        "price": opts.price || "0",
        "priceCurrency": "EUR"
      },
      "provider": {
        "@type": "Organization",
        "@id": this.baseUrl + "/#organization",
        "name": this.siteName
      }
    };
  }

  /**
   * Injecte les balises hreflang pour le multilingue (fr/nl/en)
   * À appeler dans les composants qui supportent plusieurs langues
   */
  setHreflang(path: string = ''): void {
    const langs = [
      { lang: 'fr-be', url: this.baseUrl + path },
      { lang: 'nl-be', url: this.baseUrl + path },
      { lang: 'en',    url: this.baseUrl + path },
      { lang: 'x-default', url: this.baseUrl + path },
    ];

    // Supprimer les anciens hreflang
    this.document.querySelectorAll('link[rel="alternate"][hreflang]').forEach(el => el.remove());

    langs.forEach(({ lang, url }) => {
      const link = this.renderer.createElement('link');
      this.renderer.setAttribute(link, 'rel', 'alternate');
      this.renderer.setAttribute(link, 'hreflang', lang);
      this.renderer.setAttribute(link, 'href', url);
      this.renderer.appendChild(this.document.head, link);
    });
  }
}
