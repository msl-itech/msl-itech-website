import { Component, OnInit, OnDestroy } from '@angular/core';
import { SeoService } from '../services/seo.service';

@Component({
  selector: 'app-avantages',
  templateUrl: './avantages.component.html',
  styleUrl: './avantages.component.scss',
})
export class AvantagesComponent implements OnInit, OnDestroy {
  constructor(private seoService: SeoService) { }

  ngOnInit(): void {
    // Configuration SEO retirée car ce composant est utilisé comme enfant
    // Les meta tags doivent être gérés par la page hôte (ex: AccueilComponent)


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
    // Ne pas supprimer les schemas globalement depuis un composant enfant
  }
}
