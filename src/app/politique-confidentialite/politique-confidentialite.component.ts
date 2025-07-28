import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { ConsentService } from '../services/consent.service';

@Component({
  selector: 'app-politique-confidentialite',
  templateUrl: './politique-confidentialite.component.html',
  styleUrls: ['./politique-confidentialite.component.css'],
})
export class PolitiqueConfidentialiteComponent implements OnInit, OnDestroy {
  isExporting: boolean = false;
  lastExportDate: Date | null = null;

  // Gestion des sections pliables
  expandedSections: any = {
    intro: true,
    section1: false,
    section2: false,
    section3: false,
    section4: false,
    section5: false,
    section6: false,
    section7: false,
    section8: false,
    section9: false,
    section10: false,
  };

  // Progression de lecture
  readingProgress: number = 0;
  showBackToTop: boolean = false;

  constructor(private consentService: ConsentService) {}

  ngOnInit() {
    // Charger la date du dernier export si elle existe
    const lastExport = localStorage.getItem('msl_last_export');
    if (lastExport) {
      this.lastExportDate = new Date(lastExport);
    }

    // Initialiser le calcul de progression
    this.calculateReadingProgress();
  }

  ngOnDestroy() {
    // Nettoyage si nécessaire
  }

  @HostListener('window:scroll', ['$event'])
  onWindowScroll() {
    this.calculateReadingProgress();
    this.updateBackToTopButton();
  }

  /**
   * Toggle une section (plier/déplier)
   */
  toggleSection(sectionKey: string) {
    this.expandedSections[sectionKey] = !this.expandedSections[sectionKey];
  }

  /**
   * Navigation fluide vers une section
   */
  scrollToSection(sectionId: string) {
    const element = document.getElementById(sectionId);
    if (element) {
      const offsetTop = element.offsetTop - 100; // Offset pour le header fixe
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth',
      });
    }
  }

  /**
   * Retour en haut de page
   */
  scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }

  /**
   * Calcul de la progression de lecture
   */
  private calculateReadingProgress() {
    const winScroll =
      document.body.scrollTop || document.documentElement.scrollTop;
    const height =
      document.documentElement.scrollHeight -
      document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    this.readingProgress = Math.round(scrolled);
  }

  /**
   * Mise à jour du bouton retour en haut
   */
  private updateBackToTopButton() {
    this.showBackToTop = window.pageYOffset > 300;
  }

  /**
   * Impression de la page
   */
  printPage() {
    // Temporairement développer toutes les sections pour l'impression
    const originalState = { ...this.expandedSections };
    Object.keys(this.expandedSections).forEach((key) => {
      this.expandedSections[key] = true;
    });

    // Attendre un moment pour que les sections s'affichent
    setTimeout(() => {
      window.print();

      // Restaurer l'état original après impression
      setTimeout(() => {
        this.expandedSections = originalState;
      }, 100);
    }, 100);
  }

  /**
   * Partage de la page
   */
  sharePage() {
    if (navigator.share) {
      // API Web Share native (mobile principalement)
      navigator
        .share({
          title: 'Politique de confidentialité MSL-iTECH',
          text: 'Découvrez notre politique de protection des données personnelles',
          url: window.location.href,
        })
        .catch((err) => console.log('Erreur de partage:', err));
    } else {
      // Fallback : copier le lien dans le presse-papier
      navigator.clipboard
        .writeText(window.location.href)
        .then(() => {
          alert('Lien copié dans le presse-papier !');
        })
        .catch((err) => {
          console.error('Erreur de copie:', err);
          // Fallback ultime : sélectionner le texte
          this.fallbackCopyToClipboard(window.location.href);
        });
    }
  }

  /**
   * Fallback pour copier dans le presse-papier
   */
  private fallbackCopyToClipboard(text: string) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
      document.execCommand('copy');
      alert('Lien copié dans le presse-papier !');
    } catch (err) {
      console.error('Erreur de copie:', err);
    }

    document.body.removeChild(textArea);
  }

  /**
   * Export des données utilisateur
   */
  exportUserData() {
    this.isExporting = true;

    try {
      // Utiliser le service de consentement pour exporter les données
      const userData = this.consentService.exportUserData();

      // Créer le fichier JSON
      const dataStr = JSON.stringify(userData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });

      // Créer le lien de téléchargement
      const url = window.URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `msl-itech-donnees-${
        new Date().toISOString().split('T')[0]
      }.json`;

      // Déclencher le téléchargement
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      // Sauvegarder la date d'export
      this.lastExportDate = new Date();
      localStorage.setItem(
        'msl_last_export',
        this.lastExportDate.toISOString()
      );
    } catch (error) {
      console.error("Erreur lors de l'export des données:", error);
      alert("Une erreur est survenue lors de l'export. Veuillez réessayer.");
    } finally {
      this.isExporting = false;
    }
  }

  /**
   * Développer toutes les sections
   */
  expandAllSections() {
    Object.keys(this.expandedSections).forEach((key) => {
      this.expandedSections[key] = true;
    });
  }

  /**
   * Replier toutes les sections
   */
  collapseAllSections() {
    Object.keys(this.expandedSections).forEach((key) => {
      this.expandedSections[key] = false;
    });
    // Garder l'introduction ouverte
    this.expandedSections.intro = true;
  }
}
