import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-service3',
  templateUrl: './service3.component.html',
  styleUrl: './service3.component.css'
})
export class Service3Component {
  @HostListener('window:scroll', [])
  onWindowScroll() {
    const header = document.getElementById('header');
    if (window.pageYOffset > header!.offsetTop) {
      header!.classList.add('sticky');
    } else {
      header!.classList.remove('sticky');
    }

    this.updateDynamicImage();
  }

  updateDynamicImage() {
    const sections = document.querySelectorAll('.section');
    const image = document.getElementById('dynamic-image') as HTMLImageElement;
    const images: { [key: string]: string } = {
      "Comptabilité": "../../assets/img/servicePage/hero_image.jpg",
      "Facturation": "../../assets/img/servicePage/interface.jpg",
      "Note-de-Frais": "../../assets/img/servicePage/rental_product.jpg",
      "Document": "../../assets/img/servicePage/hero_image.jpg",
      "Feuille-de-calcul": "../../assets/img/servicePage/interface.jpg"
    };

    let lastSection: string | undefined;

    sections.forEach((section) => {
      const rect = section.getBoundingClientRect();
      if (rect.top < window.innerHeight / 2 && rect.bottom >= window.innerHeight / 2) {
        lastSection = section.id;
      }
    });

    if (lastSection && image.src !== images[lastSection]) {
      image.src = images[lastSection];
    }
  }

}
