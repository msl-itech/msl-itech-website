import { DOCUMENT } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { SeoService } from '../seo.service';

@Component({
  selector: 'app-avantages',
  templateUrl: './avantages.component.html',
  styleUrl: './avantages.component.css'
})
export class AvantagesComponent {
   constructor(  private seoService: SeoService,
    @Inject(DOCUMENT) private document: Document){}
    pageDescription: string = 'Découvrez les 4 raisons de collaborer avec MSL Itech, votre partenaire certifié Odoo. Expertise, personnalisation, présence internationale, et coûts compétitifs.';
    pageKeywords: string = 'MSL Itech, Odoo, partenaire Odoo, consulting Odoo, développement Odoo, intégration Odoo, ERP Odoo, Belgique, Canada, Maroc, personnalisation Odoo';
    ngOnInit(): void {
      // Mettre à jour le titre et les balises meta
      this.seoService.updateMetaTags([
        { name: 'description', content: this.pageDescription },
        { name: 'keywords', content: this.pageKeywords },
        { name: 'robots', content: 'index, follow' },
        { name: 'author', content: 'MSL Itech' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      ]);
      // Mettre à jour les balises hreflang
  
      // Ajouter les données structurées JSON-LD
      this.addStructuredData();
    }
    private addStructuredData(): void {
      const structuredData = {
        "@context": "https://schema.org",
        "@type": "Service",
        "name": "Consulting Odoo",
        "provider": {
          "@type": "Organization",
          "name": "MSL Itech",
          "url": "https://www.msl-itech.com",
          "logo": "https://www.msl-itech.com/assets/img/accueil/logoMSL.png",
          "areaServed": ["Belgium", "Canada", "Morocco"]
        },
        "description": "MSL Itech, partenaire certifié Odoo, offre des services de développement, intégration, et consulting ERP en Belgique, Canada, et Maroc.",
        "offers": {
          "@type": "Offer",
          "priceCurrency": "MAD",
          "eligibleRegion": ["BE", "CA", "MA"],
          "url": "https://www.msl-itech.com"
        }
      };
  
      const script = this.document.createElement('script');
      script.type = 'application/ld+json';
      script.text = JSON.stringify(structuredData);
      this.document.head.appendChild(script);
    }
}
