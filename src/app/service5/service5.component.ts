import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-service5',
  templateUrl: './service5.component.html',
  styleUrl: './service5.component.css'
})
export class Service5Component {
  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.updateDynamicImage();
  }

  updateDynamicImage() {
    const sections = document.querySelectorAll('.section');
    const image = document.getElementById('dynamic-image') as HTMLImageElement;
    const images: { [key: string]: string } = {
        "Employes": "../../assets/img/serviceOdoo/employee.webp",
        "Recrutement": "../../assets/img/serviceOdoo/recrutement.webp",
        "Conges": "../../assets/img/serviceOdoo/conge.webp",
        "Evaluations": "../../assets/img/serviceOdoo/evaluation.png",
        "Recommandation": "../../assets/img/serviceOdoo/recommandation.png",
        "ParcAutomobile": "../../assets/img/serviceOdoo/parc_auto.png"
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
