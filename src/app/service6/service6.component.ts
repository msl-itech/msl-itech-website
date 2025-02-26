import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-service6',
  templateUrl: './service6.component.html',
  styleUrl: './service6.component.css'
})
export class Service6Component {
  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.updateDynamicImage();
  }

  updateDynamicImage() {
    const sections = document.querySelectorAll('.section');
    const image = document.getElementById('dynamic-image') as HTMLImageElement;
    const images: { [key: string]: string } = {
      "AutomatisationMarketing": "../../assets/img/serviceOdoo/automatisation_marketing.gif",
      "EmailMarketing": "../../assets/img/serviceOdoo/Email_Marketing.png",
      "SMSMarketing": "../../assets/img/serviceOdoo/sms-marketing.gif",
      "SocialMarketing": "../../assets/img/serviceOdoo/Social_Marketing.gif",
      "Evenements": "../../assets/img/serviceOdoo/Evenement.png",
      "Sondage": "../../assets/img/serviceOdoo/Sondage.png"
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
