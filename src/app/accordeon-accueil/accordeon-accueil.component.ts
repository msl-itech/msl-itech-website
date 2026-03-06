import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { SeoService } from '../services/seo.service';

@Component({
  selector: 'app-accordeon-accueil',
  templateUrl: './accordeon-accueil.component.html',
  styleUrl: './accordeon-accueil.component.scss'
})
export class AccordeonAccueilComponent {

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
   constructor(
      private seoService: SeoService,
      private translate: TranslateService
    ) {}

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
  }
}
