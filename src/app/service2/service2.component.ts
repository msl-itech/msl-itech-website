import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-service2',
  templateUrl: './service2.component.html',
  styleUrl: './service2.component.css'
})
export class Service2Component {
  
  constructor() { }

  ngOnInit(): void {
    this.updateDynamicImage();
  }

  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    const isMobile = window.innerWidth <= 768; // Définir la limite mobile
    if (isMobile) {
      // Ne pas exécuter le changement dynamique en mode mobile
      this.removeStickyClass();
      return;
    }

    const header = document.getElementById('header');
    if (header) {
      if (window.pageYOffset > header.offsetTop) {
        header.classList.add('sticky');
      } else {
        header.classList.remove('sticky');
      }
    }

    this.updateDynamicImage();
  }

  @HostListener('window:resize', [])
  onWindowResize(): void {
    this.updateDynamicImage();
    this.removeStickyClassIfMobile();
  }

  private removeStickyClass(): void {
    const header = document.getElementById('header');
    if (header) {
      header.classList.remove('sticky');
    }
  }

  private removeStickyClassIfMobile(): void {
    const isMobile = window.innerWidth <= 768;
    if (isMobile) {
      this.removeStickyClass();
    }
  }

  updateDynamicImage(): void {
    const isMobile = window.innerWidth <= 768;
    if (isMobile) {
      // Ne pas changer l'image en mode mobile
      return;
    }

    const sections = document.querySelectorAll('.section');
    const image = document.getElementById('dynamic-image') as HTMLImageElement;
    const images: { [key: string]: string } = {
      'crm': '../../assets/img/servicePage/hero_image.jpg',
      'ventes': '../../assets/img/servicePage/interface.jpg',
      'pos': '../../assets/img/servicePage/rental_product.jpg',
      'abonnements': '../../assets/img/servicePage/hero_image.jpg',
      'location': '../../assets/img/servicePage/interface.jpg'
    };

    let lastSection: string | undefined;

    sections.forEach((section) => {
      const rect = section.getBoundingClientRect();
      const sectionId = (section as HTMLElement).id;
      if (rect.top < window.innerHeight / 2 && rect.bottom >= window.innerHeight / 2) {
        lastSection = sectionId;
      }
    });

    if (lastSection && image.src.indexOf(images[lastSection]) === -1) {
      image.src = images[lastSection];
    }
  }
}
