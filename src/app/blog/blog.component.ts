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
    title: 'Les atouts du pack gestion de projet',
    description:
      'Découvrez comment ce pack peut transformer votre façon de travailler, avec des exemples concrets d\'entreprises qui ont réussi.',
    link: '#'
  },
  {
    img: '../../assets/img/accueil/img2.png', // Image de remplacement
    date: '15 Nov 2024',
    title: 'Avant/Après',
    description:
      'Visualisez l\'impact de nos packs sur la productivité et l\'organisation d\'une entreprise.',
    link: '#'
  },
  {
    img: '../../assets/img/accueil/img3.png', // Image de remplacement
    date: '10 Nov 2024',
    title: 'Pourquoi choisir MSL-ITECH ?',
    description:
      'Nous vous accompagnons à chaque étape, de l\'analyse de vos besoins à la mise en place des solutions.',
    link: '#'
  }
];
}
