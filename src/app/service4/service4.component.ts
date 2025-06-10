import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-service4',
  templateUrl: './service4.component.html',
  styleUrl: './service4.component.css',
})
export class Service4Component {
  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.updateDynamicImage();
  }

  updateDynamicImage() {
    const sections = document.querySelectorAll('.section');
    const image = document.getElementById('dynamic-image') as HTMLImageElement;
    const images: { [key: string]: string } = {
      Inventaire: '../../assets/img/serviceOdoo/inventaire.webp',
      Fabrication: '../../assets/img/serviceOdoo/fabrication.webp',
      PLM: '../../assets/img/serviceOdoo/Plm.gif',
      Achats: '../../assets/img/serviceOdoo/achat.webp',
      Maintenance: '../../assets/img/serviceOdoo/maintenance.gif',
      Qualite: '../../assets/img/serviceOdoo/qualite.webp',
    };

    let lastSection: string | undefined;

    sections.forEach((section) => {
      const rect = section.getBoundingClientRect();
      if (
        rect.top < window.innerHeight / 2 &&
        rect.bottom >= window.innerHeight / 2
      ) {
        lastSection = section.id;
      }
    });

    if (lastSection && image.src !== images[lastSection]) {
      image.src = images[lastSection];
    }
  }
}
