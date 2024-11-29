import { DOCUMENT } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { SeoService } from '../seo.service';

@Component({
  selector: 'app-page-package',
  templateUrl: './page-package.component.html',
  styleUrl: './page-package.component.css'
})
export class PagePackageComponent {
  pageTitle: string = 'Offres Tarifaires Flexibles | MSL Itech - Partenaire Odoo';
  pageDescription: string = 'Découvrez nos offres tarifaires flexibles et adaptées à vos besoins métier avec MSL Itech, partenaire certifié Odoo.';
  pageKeywords: string = 'offres tarifaires, MSL Itech, Odoo, ERP, tarifs flexibles, développeur Odoo, respect des délais, qualité 100%';

  constructor(
    private seoService: SeoService,
    @Inject(DOCUMENT) private document: Document
  ) {}

  ngOnInit(): void {
    // Mise à jour du SEO avec SeoService
    this.seoService.updateTitle(this.pageTitle);
    this.seoService.updateMetaTags([
      { name: 'description', content: this.pageDescription },
      { name: 'keywords', content: this.pageKeywords },
      { name: 'robots', content: 'index, follow' },
      { name: 'author', content: 'MSL Itech' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    ]);

    // Ajouter les données structurées JSON-LD
    this.addStructuredData();
  }

  // Méthode pour ajouter des données structurées JSON-LD
  private addStructuredData(): void {
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "Product",
      "name": "Offres Tarifaires ERP Odoo",
      "brand": {
        "@type": "Organization",
        "name": "MSL Itech"
      },
      "description": "Des offres tarifaires flexibles et adaptées aux besoins métier avec MSL Itech, partenaire Odoo.",
      "offers": {
        "@type": "Offer",
        "priceCurrency": "MAD",
        "eligibleRegion": ["BE", "CA", "MA"],
        "url": "https://www.msl-itech.com/package-metier"
      }
    };

    const script = this.document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(structuredData);
    this.document.head.appendChild(script);
  }
}
