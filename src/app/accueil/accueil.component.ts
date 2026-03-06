import { Component, OnDestroy, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { SeoService } from '../services/seo.service';

@Component({
  selector: 'app-accueil',
  templateUrl: './accueil.component.html',
  styleUrl: './accueil.component.css',
})
export class AccueilComponent implements OnInit, OnDestroy {
  private translateSubscription: Subscription = new Subscription();

  constructor(
    private seoService: SeoService,
    private translate: TranslateService
  ) {}

  // Gérer l'état d'expansion des éléments de l'accordéon
  accordionItems = [
    {
      title: '',
      content: '',
      isExpanded: true,
    },
    {
      title: '',
      content: '',
      isExpanded: false,
    },
    {
      title: '',
      content: '',
      isExpanded: false,
    },
  ];

  toggleAccordion(item: any) {
    item.isExpanded = !item.isExpanded;
  }

  slides = [
    { img: 'assets/img/accueil/maroc.png', alt: 'Drapeau du Maroc' },
    { img: 'assets/img/accueil/france.png', alt: 'Drapeau de la France' },
    { img: 'assets/img/accueil/usa.png', alt: 'Drapeau des USA' },
  ];

  currentSlide = 0;

  goToSlide(index: number) {
    this.currentSlide = index;
  }

  private loadAccordionItems() {
    this.accordionItems = [
      {
        title: this.translate.instant('PAGES.HOME.ACCORDION.ALL_IN_ONE.TITLE'),
        content: this.translate.instant(
          'PAGES.HOME.ACCORDION.ALL_IN_ONE.CONTENT'
        ),
        isExpanded: true,
      },
      {
        title: this.translate.instant('PAGES.HOME.ACCORDION.MODULARITY.TITLE'),
        content: this.translate.instant(
          'PAGES.HOME.ACCORDION.MODULARITY.CONTENT'
        ),
        isExpanded: false,
      },
      {
        title: this.translate.instant('PAGES.HOME.ACCORDION.SUPPORT.TITLE'),
        content: this.translate.instant('PAGES.HOME.ACCORDION.SUPPORT.CONTENT'),
        isExpanded: false,
      },
    ];
  }

  ngOnInit(): void {
    this.loadAccordionItems();

    // S'abonner aux changements de langue
    this.translateSubscription = this.translate.onLangChange.subscribe(() => {
      this.loadAccordionItems();
    });

    // Configuration SEO
    this.seoService.updateMetaTags({
      title: 'MSL iTech - Consulting Odoo & Solutions ERP',
      description: 'Expert en consulting Odoo et implémentation ERP sur mesure. Découvrez nos packages métier spécialisés pour PME belges : Finance, Ventes, RH, Fabrication. Démo gratuite.',
      keywords: 'Odoo Belgique, ERP, consulting Odoo, implémentation Odoo, CRM, comptabilité, gestion entreprise, package métier',
      url: '/accueil',
      type: 'website',
      image: 'https://www.msl-itech.com/assets/img/accueil/hero-image.jpg'
    });

    // Ajouter BreadcrumbList schema
    const breadcrumbSchema = this.seoService.generateBreadcrumbSchema([
      { name: 'Accueil', url: '/accueil' }
    ]);
    this.seoService.addJsonLdSchema(breadcrumbSchema);
  }

  ngOnDestroy(): void {
    this.translateSubscription.unsubscribe();
    // Nettoyer les schemas ajoutés
    this.seoService.removeAllJsonLdSchemas();
  }
}
