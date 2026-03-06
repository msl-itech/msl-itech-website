import { Component, OnInit, OnDestroy } from '@angular/core';
import { SeoService } from '../services/seo.service';

@Component({
  selector: 'app-page-package',
  templateUrl: './page-package.component.html',
  styleUrl: './page-package.component.css'
})
export class PagePackageComponent implements OnInit, OnDestroy {

  constructor(private seoService: SeoService) {}

  ngOnInit(): void {
    // Configuration SEO
    this.seoService.updateMetaTags({
      title: 'Packages Métier Odoo - Solutions Clés en Main',
      description: 'Découvrez nos packages métier Odoo clés en main : Horeca, Commerce, Administration. Solutions pré-configurées et prêtes à l\'emploi.',
      keywords: 'package Odoo, solution clé en main, Odoo Horeca, package métier, solution pré-configurée, tarifs Odoo',
      url: '/package-metier',
      type: 'website'
    });

    // Ajouter Product schema
    const productSchema = {
      "@context": "https://schema.org",
      "@type": "Product",
      "name": "Packages Métier ERP Odoo",
      "brand": {
        "@type": "Organization",
        "name": "MSL iTech"
      },
      "description": "Des packages métier flexibles et adaptés aux besoins spécifiques avec MSL iTech, partenaire Odoo.",
      "offers": {
        "@type": "Offer",
        "priceCurrency": "EUR",
        "eligibleRegion": "BE",
        "url": "https://www.msl-itech.com/package-metier"
      }
    };
    this.seoService.addJsonLdSchema(productSchema);

    // Ajouter BreadcrumbList
    const breadcrumbSchema = this.seoService.generateBreadcrumbSchema([
      { name: 'Accueil', url: '/accueil' },
      { name: 'Packages Métier', url: '/package-metier' }
    ]);
    this.seoService.addJsonLdSchema(breadcrumbSchema);
  }

  ngOnDestroy() {
    this.seoService.removeAllJsonLdSchemas();
  }
}
