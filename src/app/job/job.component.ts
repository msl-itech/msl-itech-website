import { DOCUMENT } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { SeoService } from '../seo.service';

@Component({
  selector: 'app-job',
  templateUrl: './job.component.html',
  styleUrl: './job.component.css'
})
export class JobComponent {
  pageTitle: string = 'Rejoignez notre Équipe | Offres d’Emploi | MSL Itech';
  pageDescription: string = 'Découvrez nos offres d’emploi chez MSL Itech et rejoignez notre équipe dynamique, partenaire certifié Odoo en Belgique, Canada et Maroc.';
  pageKeywords: string = 'emploi MSL Itech, job Odoo, recrutement Odoo, carrière ERP, Belgique, Canada, Maroc, partenaire Odoo';

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
      "@type": "JobPosting",
      "title": "Offres d’emploi chez MSL Itech",
      "description": "Rejoignez notre équipe et découvrez des opportunités de carrière dans le domaine ERP avec MSL Itech, partenaire Odoo en Belgique, Canada et Maroc.",
      "datePosted": new Date().toISOString(),
      "hiringOrganization": {
        "@type": "Organization",
        "name": "MSL Itech",
        "logo": "https://www.msl-itech.com/assets/img/accueil/logoMSL.png",
        "url": "https://www.msl-itech.com",
      },
      "jobLocation": [
        { "@type": "Place", "addressCountry": "Belgium" },
        { "@type": "Place", "addressCountry": "Canada" },
        { "@type": "Place", "addressCountry": "Morocco" }
      ],
      "employmentType": "Full-time",
      "validThrough": "2025-12-31T23:59:59Z",
      "baseSalary": {
        "@type": "MonetaryAmount",
        "currency": "MAD",
        "value": { "@type": "QuantitativeValue", "value": 50000 }
      }
    };

    const script = this.document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(structuredData);
    this.document.head.appendChild(script);
  }
}
