import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-slider',
  templateUrl: './slider.component.html',
  styleUrl: './slider.component.css'
})
export class SliderComponent {
  slides = [
    {
      id: 'slide1',
      img: '../../assets/img/accueil/Slide1.jpg',
      title: 'Gérez simplement, innovez différemment avec',
      highlight: 'Odoo',
      description: 'Réinventez votre activité grâce à des solutions logicielles conçues pour répondre à votre marché.',
      buttons: []
    },
    {
      id: 'slide2',
      img: '../../assets/img/accueil/femme_slide2.png',
      title: 'Nous sommes partenaire',
      highlight: 'Odoo',
      description: 'Prenez contact avec un de nos experts Odoo dès maintenant pour discuter de vos besoins.',
      buttons: [
        { text: 'Contactez-nous', link: 'contact', color: '#ffcc00', textColor: '#000000' },
        { text: 'Réserver une démo', link: 'reserve-demo', color: '#114D5A', textColor: '#ffffff' }
      ]
    },
    {
      id: 'slide3',
      img: '../../assets/img/accueil/man3.jpg',
      title: 'Support 6J/7 24/24 - Français/Anglais',
      highlight: 'anticiper demain',
      description: 'Représenté dans 3 pays, même service, même standard',
      buttons: [
        { text: 'Contactez-nous', link: 'about', color: '#ffcc00', textColor: '#000000' }
      ]
    }
  ];

  currentSlide = 0;
  intervalId: any;

  constructor(private router: Router) {}

  ngOnInit() {
    this.startAutoSlide();
  }

  ngOnDestroy() {
    this.stopAutoSlide();
  }

  // Commencer le défilement automatique
  startAutoSlide() {
    this.intervalId = setInterval(() => this.nextSlide(), 6000);
  }

  // Arrêter le défilement automatique
  stopAutoSlide() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  // Afficher un slide spécifique
  showSlide(index: number) {
    this.currentSlide = index;
  }

  // Passer au prochain slide
  nextSlide() {
    const nextIndex = (this.currentSlide + 1) % this.slides.length;
    this.showSlide(nextIndex);
  }

  // Navigation via les boutons des slides
  navigateTo(link: string) {
    this.router.navigate([link]);
  }

  // Générer le style transform pour l'animation des slides
  getTransform(): string {
    return `translateX(-${this.currentSlide * 100}%)`;
  }
}
