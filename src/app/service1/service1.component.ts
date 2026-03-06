import { Component, OnInit, OnDestroy } from '@angular/core';
import { SeoService } from '../services/seo.service';

@Component({
  selector: 'app-service1',
  templateUrl: './service1.component.html',
  styleUrl: './service1.component.css'
})
export class Service1Component implements OnInit, OnDestroy {

  constructor(private seoService: SeoService) {}

  ngOnInit(): void {
    // Configuration SEO
    this.seoService.updateMetaTags({
      title: 'Services Consulting Odoo - Implémentation & Support',
      description: 'Services complets de consulting Odoo : implémentation, personnalisation, formation et support. Experts certifiés Odoo pour accompagner votre transformation digitale.',
      keywords: 'consulting Odoo, implémentation Odoo, formation Odoo, support Odoo, expert Odoo Belgique, partenaire Odoo',
      url: '/serviceOdoo',
      type: 'service'
    });

    // Ajouter Service schema
    const serviceSchema = this.seoService.generateServiceSchema(
      'Consulting et Implémentation Odoo',
      'Services complets de consulting Odoo incluant implémentation, personnalisation, formation et support technique pour entreprises belges'
    );
    this.seoService.addJsonLdSchema(serviceSchema);

    // Ajouter BreadcrumbList
    const breadcrumbSchema = this.seoService.generateBreadcrumbSchema([
      { name: 'Accueil', url: '/accueil' },
      { name: 'Services Odoo', url: '/serviceOdoo' }
    ]);
    this.seoService.addJsonLdSchema(breadcrumbSchema);
  }

  ngOnDestroy() {
    this.seoService.removeAllJsonLdSchemas();
  }
}
