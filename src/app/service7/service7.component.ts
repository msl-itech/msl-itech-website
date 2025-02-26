import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-service7',
  templateUrl: './service7.component.html',
  styleUrl: './service7.component.css'
})
export class Service7Component {
  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.updateDynamicImage();
  }

  updateDynamicImage() {
    const sections = document.querySelectorAll('.section');
    const image = document.getElementById('dynamic-image') as HTMLImageElement;
    const images: { [key: string]: string } = {
      "GestionProjet": "../../assets/img/serviceOdoo/project.webp",
      "FeuilleTemps": "../../assets/img/serviceOdoo/feuille_temps.webp",
      "ServicesSurSite": "../../assets/img/serviceOdoo/service-sur-site.webp",
      "Assistance": "../../assets/img/serviceOdoo/helpdesk-dashboard.webp",
      "Planification": "../../assets/img/serviceOdoo/planning.webp",
      "RendezVous": "../../assets/img/serviceOdoo/rendez-vous.webp"
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
