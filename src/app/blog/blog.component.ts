import { Component } from '@angular/core';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrl: './blog.component.css'
})
export class BlogComponent {
  articles = [
  {
    img: '../../assets/img/accueil/img1.png', // Image de remplacement
    date: '20 Nov 2024',
    title: 'Les tendances technologiques de 2024',
    description:
      'Découvrez les dernières innovations et tendances technologiques qui transforment notre monde.',
    link: '#'
  },
  {
    img: '../../assets/img/accueil/img2.png', // Image de remplacement
    date: '15 Nov 2024',
    title: 'Comment améliorer la productivité avec Odoo',
    description:
      'Un guide complet pour tirer le meilleur parti de votre solution ERP avec Odoo.',
    link: '#'
  },
  {
    img: '../../assets/img/accueil/img3.png', // Image de remplacement
    date: '10 Nov 2024',
    title: 'Les 10 erreurs courantes en gestion de projet',
    description:
      'Apprenez à éviter les erreurs fréquentes dans vos projets pour garantir leur réussite.',
    link: '#'
  }
];
}
