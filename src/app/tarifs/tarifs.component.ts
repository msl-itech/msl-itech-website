import { Component } from '@angular/core';
import { trigger, style, transition, animate } from '@angular/animations';
@Component({
  selector: 'app-tarifs',
  templateUrl: './tarifs.component.html',
  styleUrl: './tarifs.component.css'
})
export class TarifsComponent {
   activePackage: string = 'wordpress';

  wordpressPackages = [
    {
      title: 'Essentiel',
      description: 'Pour un site rapide et professionnel',
      price: 2500,
      time: 45,
      features: ['Design épuré', 'Pages clés', 'Optimisation mobile'],
    },
    {
      title: 'Intermédiaire',
      description: 'Pour un design personnalisé et des options avancées',
      price: 3500,
      time: 65,
      features: ['Design sur mesure', 'Contenu optimisé', 'Fonctionnalités avancées'],
    },
    {
      title: 'Premium',
      description: 'Pour les entreprises en croissance',
      price: 5000,
      time: 90,
      features: ['Design sur mesure', 'Intégrations complexes', 'Optimisation complète'],
    },
  ];

  javascriptPackages = [
    {
      title: 'Essentiel',
      description: 'Pour un site rapide et adapté',
      price: 3750,
      time: 68,
      features: ['Développement sur mesure', 'Structure robuste', 'Design ergonomique'],
    },
    {
      title: 'Intermédiaire',
      description: 'Fonctionnalités avancées et optimisation UX',
      price: 5250,
      time: 98,
      features: ['Fonctionnalités avancées', 'Intégration API', 'Expérience utilisateur'],
    },
    {
      title: 'Premium',
      description: 'Pour une solution complète',
      price: 7500,
      time: 135,
      features: ['Développement personnalisé', 'Intégrations complexes', 'Optimisation maximale'],
    },
  ];

  switchPackage(packageType: string) {
    this.activePackage = packageType;
  }
}
