import { Component, HostListener, OnInit, OnDestroy } from '@angular/core';
import { SeoService } from '../services/seo.service';

@Component({
  selector: 'app-service6',
  templateUrl: './service6.component.html',
  styleUrl: './service6.component.css'
})
export class Service6Component implements OnInit, OnDestroy {
  constructor(private seoService: SeoService) {}

  ngOnInit(): void {
    // Configuration SEO
    this.seoService.updateMetaTags({
      title: 'Odoo Marketing Digital - Automation & Campagnes',
      description: 'Module Odoo Marketing pour vos campagnes digitales : email marketing, SMS, réseaux sociaux, événements, sondages. Automatisez votre marketing.',
      keywords: 'Odoo marketing, email marketing, SMS marketing, automation marketing, campagnes digitales, réseaux sociaux',
      url: '/marketing-digital',
      type: 'service'
    });

    // Ajouter Service schema
    const serviceSchema = this.seoService.generateServiceSchema(
      'Marketing Digital et Automation Odoo',
      'Module Odoo pour le marketing digital : automation, email marketing, SMS, réseaux sociaux, gestion événements et sondages'
    );
    this.seoService.addJsonLdSchema(serviceSchema);

    // Ajouter BreadcrumbList
    const breadcrumbSchema = this.seoService.generateBreadcrumbSchema([
      { name: 'Accueil', url: '/accueil' },
      { name: 'Marketing Digital', url: '/marketing-digital' }
    ]);
    this.seoService.addJsonLdSchema(breadcrumbSchema);
  }

  ngOnDestroy() {
    this.seoService.removeAllJsonLdSchemas();
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.updateDynamicImage();
  }

  updateDynamicImage() {
    const sections = document.querySelectorAll('.section');
    const image = document.getElementById('dynamic-image') as HTMLImageElement;
    const images: { [key: string]: string } = {
      "AutomatisationMarketing": "../../assets/img/serviceOdoo/automatisation_marketing.gif",
      "EmailMarketing": "../../assets/img/serviceOdoo/Email_Marketing.png",
      "SMSMarketing": "../../assets/img/serviceOdoo/sms-marketing.gif",
      "SocialMarketing": "../../assets/img/serviceOdoo/Social_Marketing.gif",
      "Evenements": "../../assets/img/serviceOdoo/Evenement.png",
      "Sondage": "../../assets/img/serviceOdoo/Sondage.png"
    };

    let lastSection: string | undefined;

    sections.forEach((section) => {
      const rect = section.getBoundingClientRect();
      if (rect.top < window.innerHeight / 2 && rect.bottom >= window.innerHeight / 2) {
        lastSection = section.id;
      }
    });

    if (lastSection && image.src !== images[lastSection]) {
      image.src = images[lastSection];
    }
  }
}
