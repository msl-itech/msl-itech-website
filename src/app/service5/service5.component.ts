import { Component, HostListener, OnInit, OnDestroy } from '@angular/core';
import { SeoService } from '../services/seo.service';

@Component({
  selector: 'app-service5',
  templateUrl: './service5.component.html',
  styleUrl: './service5.component.css',
  styles: [
    `
      :host ::ng-deep .header-section {
        background: linear-gradient(135deg, #114d5a 0%, #114d5a 100%);
        padding: 120px 20px 80px;
        position: relative;
        overflow: hidden;
        margin-top: -172px;
      }

      :host ::ng-deep .animated-bg {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(
          45deg,
          rgba(255, 204, 0, 0.1) 25%,
          transparent 25%,
          transparent 50%,
          rgba(255, 204, 0, 0.1) 50%,
          rgba(255, 204, 0, 0.1) 75%,
          transparent 75%,
          transparent
        );
        background-size: 100px 100px;
        animation: slide 30s linear infinite;
        opacity: 0.5;
        z-index: 1;
      }

      @keyframes slide {
        0% {
          background-position: 0 0;
        }
        100% {
          background-position: 1000px 1000px;
        }
      }

      :host ::ng-deep .header-content {
        max-width: 1200px;
        margin: 0 auto;
        text-align: center;
        position: relative;
        z-index: 2;
      }

      :host ::ng-deep .title-wrapper {
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 3rem;
        position: relative;
      }

      :host ::ng-deep .decorative-line {
        height: 2px;
        width: 100px;
        background: linear-gradient(90deg, transparent, #ffcc00, transparent);
        margin: 0 20px;
      }

      :host ::ng-deep .header-section h1 {
        font-size: 3.5rem;
        color: #ffcc00;
        line-height: 1.2;
        text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
        position: relative;
        margin: 0;
        padding: 0;
      }

      :host ::ng-deep .subtitle-wrapper {
        position: relative;
        margin-top: 1rem;
      }

      :host ::ng-deep .highlight {
        color: #fff;
        font-weight: 300;
        font-size: 0.5em;
        display: block;
        margin-top: 0.5rem;
        text-transform: uppercase;
        letter-spacing: 2px;
      }

      :host ::ng-deep .accent-bar {
        width: 80px;
        height: 4px;
        background: linear-gradient(90deg, #ffcc00, #ffcc00);
        margin: 1rem auto;
        border-radius: 2px;
      }

      :host ::ng-deep .video {
        position: relative;
        padding: 0 20px;
        margin-top: 2rem;
        z-index: 2;
      }

      :host ::ng-deep .video-wrapper {
        position: relative;
        border-radius: 20px;
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3),
          0 0 30px rgba(255, 204, 0, 0.2);
        transition: all 0.5s ease;
        overflow: hidden;
        margin: 0 auto;
        max-width: 800px;
        padding: 10px;
        background: linear-gradient(45deg, #114d5a, #114d5a);
      }

      :host ::ng-deep .corner-decoration {
        position: absolute;
        width: 30px;
        height: 30px;
        border: 2px solid #ffcc00;
        z-index: 2;
      }

      :host ::ng-deep .top-left {
        top: 10px;
        left: 10px;
        border-right: none;
        border-bottom: none;
      }

      :host ::ng-deep .top-right {
        top: 10px;
        right: 10px;
        border-left: none;
        border-bottom: none;
      }

      :host ::ng-deep .bottom-left {
        bottom: 10px;
        left: 10px;
        border-right: none;
        border-top: none;
      }

      :host ::ng-deep .bottom-right {
        bottom: 10px;
        right: 10px;
        border-left: none;
        border-top: none;
      }

      :host ::ng-deep .video-wrapper:hover {
        transform: translateY(-5px) scale(1.02);
        box-shadow: 0 25px 50px rgba(0, 0, 0, 0.4),
          0 0 40px rgba(255, 204, 0, 0.3);
      }

      :host ::ng-deep .image-overlay {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(
          180deg,
          rgba(255, 204, 0, 0.2) 0%,
          rgba(255, 204, 0, 0.1) 100%
        );
        z-index: 1;
        pointer-events: none;
      }

      :host ::ng-deep .video-wrapper img.service-hero-image {
        width: 100%;
        height: 400px;
        border-radius: 15px;
        object-fit: cover;
        display: block;
        margin: 0 auto;
        transition: transform 0.5s ease;
        filter: brightness(1.1) contrast(1.1);
      }

      :host ::ng-deep .video-wrapper:hover img.service-hero-image {
        transform: scale(1.05);
      }

      @media (max-width: 1024px) {
        :host ::ng-deep .header-section h1 {
          font-size: 3rem;
        }

        :host ::ng-deep .video-wrapper img.service-hero-image {
          height: 350px;
        }

        :host ::ng-deep .decorative-line {
          width: 70px;
        }
      }

      @media (max-width: 768px) {
        :host ::ng-deep .header-section {
          padding: 100px 20px 60px;
        }

        :host ::ng-deep .header-section h1 {
          font-size: 2.5rem;
        }

        :host ::ng-deep .video-wrapper img.service-hero-image {
          height: 300px;
        }

        :host ::ng-deep .decorative-line {
          width: 50px;
        }

        :host ::ng-deep .corner-decoration {
          width: 20px;
          height: 20px;
        }
      }

      @media (max-width: 540px) {
        :host ::ng-deep .header-section {
          padding: 80px 15px 40px;
        }

        :host ::ng-deep .header-section h1 {
          font-size: 2rem;
        }

        :host ::ng-deep .decorative-line {
          width: 30px;
        }

        :host ::ng-deep .video-wrapper {
          box-shadow: 0 15px 30px rgba(0, 0, 0, 0.3);
        }

        :host ::ng-deep .video-wrapper img.service-hero-image {
          height: 250px;
        }

        :host ::ng-deep .corner-decoration {
          width: 15px;
          height: 15px;
        }
      }
    `,
  ],
})
export class Service5Component implements OnInit, OnDestroy {
  constructor(private seoService: SeoService) {}

  ngOnInit(): void {
    // Configuration SEO
    this.seoService.updateMetaTags({
      title: 'Odoo Ressources Humaines - Gestion RH Complète',
      description: 'Module Odoo RH pour la gestion des employés : recrutement, présences, congés, évaluations, paie. Simplifiez la gestion de vos ressources humaines.',
      keywords: 'Odoo RH, gestion ressources humaines, recrutement Odoo, congés, présences, évaluations, SIRH',
      url: '/ressources-humaines',
      type: 'service'
    });

    // Ajouter Service schema
    const serviceSchema = this.seoService.generateServiceSchema(
      'Gestion des Ressources Humaines Odoo',
      'Module Odoo pour la gestion RH complète : recrutement, présences, congés, évaluations, feuilles de temps et gestion de paie'
    );
    this.seoService.addJsonLdSchema(serviceSchema);

    // Ajouter BreadcrumbList
    const breadcrumbSchema = this.seoService.generateBreadcrumbSchema([
      { name: 'Accueil', url: '/accueil' },
      { name: 'Ressources Humaines', url: '/ressources-humaines' }
    ]);
    this.seoService.addJsonLdSchema(breadcrumbSchema);
  }

  ngOnDestroy() {
    this.seoService.removeAllJsonLdSchemas();
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.updateDynamicImage();
  }

  updateDynamicImage() {
    const sections = document.querySelectorAll('.section');
    const image = document.getElementById('dynamic-image') as HTMLImageElement;
    const images: { [key: string]: string } = {
      Employes: '../../assets/img/serviceOdoo/employee.webp',
      Recrutement: '../../assets/img/serviceOdoo/recrutement.webp',
      Conges: '../../assets/img/serviceOdoo/conge.webp',
      Evaluations: '../../assets/img/serviceOdoo/evaluation.png',
      Recommandation: '../../assets/img/serviceOdoo/recommandation.png',
      ParcAutomobile: '../../assets/img/serviceOdoo/parc_auto.png',
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
