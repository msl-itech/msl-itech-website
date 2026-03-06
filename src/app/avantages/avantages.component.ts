import { Component, OnInit, OnDestroy } from '@angular/core';
import { SeoService } from '../services/seo.service';

@Component({
  selector: 'app-avantages',
  templateUrl: './avantages.component.html',
  styleUrl: './avantages.component.scss',
})
export class AvantagesComponent implements OnInit, OnDestroy {
  constructor(private seoService: SeoService) {}

  ngOnInit(): void {
    // Configuration SEO
    this.seoService.updateMetaTags({
      title: 'Avantages MSL iTech - Pourquoi Nous Choisir',
      description: 'Découvrez les 4 raisons de collaborer avec MSL iTech, votre partenaire certifié Odoo. Expertise, personnalisation, présence internationale, et coûts compétitifs.',
      keywords: 'MSL iTech, Odoo, partenaire Odoo, consulting Odoo, développement Odoo, intégration Odoo, ERP Odoo, Belgique',
      url: '/avantages',
      type: 'website'
    });

    // Ajouter Service schema
    const serviceSchema = {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: 'Consulting Odoo',
      provider: {
        '@type': 'Organization',
        name: 'MSL iTech',
        url: 'https://www.msl-itech.com',
        logo: 'https://www.msl-itech.com/assets/img/accueil/logoMSL.webp',
        areaServed: ['Belgium']
      },
      description: 'MSL iTech, partenaire certifié Odoo, offre des services de développement, intégration, et consulting ERP en Belgique.',
      offers: {
        '@type': 'Offer',
        priceCurrency: 'EUR',
        eligibleRegion: 'BE',
        url: 'https://www.msl-itech.com'
      }
    };
    this.seoService.addJsonLdSchema(serviceSchema);
  }

  ngOnDestroy() {
    this.seoService.removeAllJsonLdSchemas();
  }
}
