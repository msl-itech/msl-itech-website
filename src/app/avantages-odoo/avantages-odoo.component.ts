import { Component } from '@angular/core';

@Component({
  selector: 'app-avantages-odoo',
  templateUrl: './avantages-odoo.component.html',
  styleUrl: './avantages-odoo.component.css'
})
export class AvantagesOdooComponent {
 slides = [
    {
      image: '../../assets/img/avantages/avantage 2.png',
      alt: 'Automatisation et Gain de temps',
      title: 'Automatisation et Gain de temps',
      description: 'Accélérez vos processus grâce à l’automatisation. Gagnez du temps sur les tâches répétitives et concentrez-vous sur l’essentiel pour optimiser votre productivité.'
    },
    {
      image: '../../assets/img/avantages/avantage1.png',
      alt: 'Rapport financier et analyse',
      title: 'Rapport financier et analyse',
      description: 'Obtenez des rapports financiers clairs et précis pour une prise de décision éclairée. Analysez facilement vos données et suivez les performances financières de votre entreprise.'
    },
    {
      image: '../../assets/img/avantages/avantage1.png',
      alt: 'Gestion et suivi des performances',
      title: 'Gestion et suivi des performances',
      description: 'Suivez les performances de votre équipe et de vos projets en temps réel. Identifiez les points d’amélioration et ajustez votre stratégie pour atteindre vos objectifs.'
    },
    {
      image: '../../assets/img/avantages/avantage 2.png',
      alt: 'Simplification des processus',
      title: 'Simplification des processus',
      description: 'Optimisez vos opérations avec des processus simplifiés et intuitifs. Gagnez en efficacité et réduisez les erreurs pour une gestion plus fluide de votre entreprise.'
    }
  ];
  

  currentIndex = 0;

  getTranslateValue(): string {
    return `translateX(-${this.currentIndex * 100}%)`;
  }

  nextSlide(): void {
    if (this.currentIndex < this.slides.length - 1) {
      this.currentIndex++;
    } else {
      this.currentIndex = 0;
    }
  }

  prevSlide(): void {
    if (this.currentIndex > 0) {
      this.currentIndex--;
    } else {
      this.currentIndex = this.slides.length - 1;
    }
  }
}
