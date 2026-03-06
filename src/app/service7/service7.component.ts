import { Component, HostListener, OnInit, OnDestroy } from '@angular/core';
import { SeoService } from '../services/seo.service';

@Component({
  selector: 'app-service7',
  templateUrl: './service7.component.html',
  styleUrl: './service7.component.css'
})
export class Service7Component implements OnInit, OnDestroy {
  constructor(private seoService: SeoService) {}

  ngOnInit(): void {
    // Configuration SEO
    this.seoService.updateMetaTags({
      title: 'Odoo Services Professionnels - Gestion de Projets',
      description: 'Module Odoo pour les services professionnels : gestion de projets, feuilles de temps, assistance, planning, rendez-vous. Optimisez vos services.',
      keywords: 'Odoo services, gestion projets, feuilles temps, helpdesk, planning, rendez-vous, services sur site',
      url: '/services-professionnels',
      type: 'service'
    });

    // Ajouter Service schema
    const serviceSchema = this.seoService.generateServiceSchema(
      'Services Professionnels et Gestion de Projets Odoo',
      'Module Odoo pour les services professionnels : gestion de projets, feuilles de temps, helpdesk, planning et rendez-vous'
    );
    this.seoService.addJsonLdSchema(serviceSchema);

    // Ajouter BreadcrumbList
    const breadcrumbSchema = this.seoService.generateBreadcrumbSchema([
      { name: 'Accueil', url: '/accueil' },
      { name: 'Services Professionnels', url: '/services-professionnels' }
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
      "GestionProjet": "../../assets/img/serviceOdoo/project.webp",
      "FeuilleTemps": "../../assets/img/serviceOdoo/feuille_temps.webp",
      "ServicesSurSite": "../../assets/img/serviceOdoo/service-sur-site.webp",
      "Assistance": "../../assets/img/serviceOdoo/helpdesk-dashboard.webp",
      "Planification": "../../assets/img/serviceOdoo/planning.webp",
      "RendezVous": "../../assets/img/serviceOdoo/rendez-vous.webp"
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
