import { Component } from '@angular/core';
import { SeoService } from '../seo.service';
import AOS from 'aos';
@Component({
  selector: 'app-accueil',
  templateUrl: './accueil.component.html',
  styleUrl: './accueil.component.css'
})
export class AccueilComponent {

  constructor(private seoService: SeoService) { }
    // Gérer l'état d'expansion des éléments de l'accordéon
    accordionItems = [
      {
        title: 'Solution tout-en-un',
        content: `Odoo se distingue par son approche intégrée, permettant aux entreprises de gérer tous leurs processus en un seul 
        endroit, ce qui simplifie la gestion et améliore l'efficacité.`,
        isExpanded: true
      },
      {
        title: 'Modularité et flexibilité',
        content: `Vous choisissez uniquement les modules dont vous avez besoin, que ce soit pour les finances, la production ou le
        marketing, et vous pouvez les ajouter ou les retirer à mesure que votre entreprise évolue.`,
        isExpanded: false
      },
      {
        title: 'Odoo Support & Maintenance',
        content: `En tant qu’ERP open source, Odoo permet une personnalisation poussée,vous offrant la liberté d’adapter l'outil à
        vos processus spécifiques et de l'intégrer facilement à d'autres systèmes`,
        isExpanded: false
      }
    ];
  
    toggleAccordion(item: any) {
      item.isExpanded = !item.isExpanded;
    }

    slides = [
      { img: 'assets/img/accueil/maroc.png', alt: 'Drapeau du Maroc' },
      { img: 'assets/img/accueil/france.png', alt: 'Drapeau de la France' },
      { img: 'assets/img/accueil/usa.png', alt: 'Drapeau des USA' }
    ];
  
    currentSlide = 0;
  
    goToSlide(index: number) {
      this.currentSlide = index;
    }

    ngOnInit(): void {
      AOS.init({
        duration: 1000, // Durée de l'animation en millisecondes
        easing: 'ease-in-out', // Type d'animation
        once: true, // Si true, l'animation ne se répète qu'une seule fois
        mirror: false // Si true, les éléments sont animés lors du défilement vers le haut
      });
      this.seoService.updateTitle('MSL Itech - Partenaire Certifié Odoo en Belgique, Canada et Maroc');
      this.seoService.updateMetaTags([
        { name: 'description', content: 'MSL Itech est un partenaire certifié Odoo offrant des services d’implémentation, de personnalisation et de support ERP en Belgique, Canada et Maroc pour les PME et les entreprises en croissance.' },
        { name: 'keywords', content: 'partenaire Odoo, consultant Odoo, implémentation Odoo, développement Odoo, services Odoo, solutions Odoo, intégrateur Odoo, MSL Itech Odoo, Belgique, Canada, Maroc' }
      ]);
    }
}
