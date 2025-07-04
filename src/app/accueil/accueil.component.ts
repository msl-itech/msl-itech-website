import { Component, OnDestroy, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { SeoService } from '../seo.service';

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

    this.seoService.updateTitle(
      'MSL Itech - Partenaire Certifié Odoo en Belgique, Canada et Maroc'
    );
    this.seoService.updateMetaTags([
      {
        name: 'description',
        content:
          "MSL Itech est un partenaire certifié Odoo offrant des services d'implémentation, de personnalisation et de support ERP en Belgique, Canada et Maroc pour les PME et les entreprises en croissance.",
      },
      {
        name: 'keywords',
        content:
          'partenaire Odoo, consultant Odoo, implémentation Odoo, développement Odoo, services Odoo, solutions Odoo, intégrateur Odoo, MSL Itech Odoo, Belgique, Canada, Maroc',
      },
    ]);
  }

  ngOnDestroy(): void {
    this.translateSubscription.unsubscribe();
  }
}
