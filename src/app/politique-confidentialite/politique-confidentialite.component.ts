import { Component, HostListener, OnDestroy, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, DOCUMENT } from '@angular/common';
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

  constructor(
    private consentService: ConsentService,
    @Inject(PLATFORM_ID) private platformId: Object,
    @Inject(DOCUMENT) private documentRef: Document
  ) { }

  ngOnInit() {
    if (!isPlatformBrowser(this.platformId)) return;

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

  @HostListener('window:scroll')
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
    if (!isPlatformBrowser(this.platformId)) return;
    const element = this.documentRef.getElementById(sectionId);
    if (element) {
      const offsetTop = element.offsetTop - 100;
      window.scrollTo({ top: offsetTop, behavior: 'smooth' });
    }
  }

  scrollToTop() {
    if (!isPlatformBrowser(this.platformId)) return;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  /**
   * Calcul de la progression de lecture
   */
  private calculateReadingProgress() {
    if (!isPlatformBrowser(this.platformId)) return;
    const winScroll = this.documentRef.body.scrollTop || this.documentRef.documentElement.scrollTop;
    const height = this.documentRef.documentElement.scrollHeight - this.documentRef.documentElement.clientHeight;
    this.readingProgress = height ? Math.round((winScroll / height) * 100) : 0;
  }

  private updateBackToTopButton() {
    if (!isPlatformBrowser(this.platformId)) return;
    this.showBackToTop = window.pageYOffset > 300;
  }

  /**
   * Impression de la page
   */
  printPage() {
    if (!isPlatformBrowser(this.platformId)) return;
    const originalState = { ...this.expandedSections };
    Object.keys(this.expandedSections).forEach((key) => {
      this.expandedSections[key] = true;
    });
    setTimeout(() => {
      window.print();
      setTimeout(() => { this.expandedSections = originalState; }, 100);
    }, 100);
  }

  /**
   * Partage de la page
   */
  sharePage() {
    if (!isPlatformBrowser(this.platformId)) return;
    if (navigator.share) {
      navigator.share({
        title: 'Politique de confidentialité MSL-iTECH',
        text: 'Découvrez notre politique de protection des données personnelles',
        url: window.location.href,
      }).catch((err) => console.log('Erreur de partage:', err));
    } else {
      navigator.clipboard.writeText(window.location.href)
        .then(() => { alert('Lien copié dans le presse-papier !'); })
        .catch((err) => {
          console.error('Erreur de copie:', err);
          this.fallbackCopyToClipboard(window.location.href);
        });
    }
  }

  /**
   * Fallback pour copier dans le presse-papier
   */
  private fallbackCopyToClipboard(text: string) {
    if (!isPlatformBrowser(this.platformId)) return;
    const textArea = this.documentRef.createElement('textarea');
    textArea.value = text;
    textArea.style.cssText = 'position:fixed;left:-999999px;top:-999999px';
    this.documentRef.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      this.documentRef.execCommand('copy');
      alert('Lien copié dans le presse-papier !');
    } catch (err) {
      console.error('Erreur de copie:', err);
    }
    this.documentRef.body.removeChild(textArea);
  }

  /**
   * Export des données utilisateur
   */
  exportUserData() {
    if (!isPlatformBrowser(this.platformId)) return;
    this.isExporting = true;
    try {
      const userData = this.consentService.exportUserData('local');
      const dataStr = JSON.stringify(userData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = window.URL.createObjectURL(dataBlob);
      const link = this.documentRef.createElement('a');
      link.href = url;
      link.download = `msl-itech-donnees-locales-${new Date().toISOString().split('T')[0]}.json`;
      this.documentRef.body.appendChild(link);
      link.click();
      this.documentRef.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      this.lastExportDate = new Date();
      localStorage.setItem('msl_last_export', this.lastExportDate.toISOString());
    } catch (error) {
      console.error("Erreur lors de l'export des données:", error);
      alert("Une erreur est survenue lors de l'export. Veuillez réessayer.");
    } finally {
      this.isExporting = false;
    }
  }

  /**
   * Demander un export complet des données (via email)
   */
  requestCompleteExport() {
    const email = prompt(
      "Veuillez saisir votre adresse email pour recevoir l'export complet de vos données :"
    );

    if (!email) {
      return;
    }

    // Validation email simple
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert('Veuillez saisir une adresse email valide.');
      return;
    }

    this.isExporting = true;

    this.consentService
      .requestCompleteDataExport(email)
      .then((response) => {
        alert(
          `Votre demande d'export complet a été envoyée. ` +
          `Vous recevrez vos données par email dans un délai de 30 jours maximum.`
        );
      })
      .catch((error) => {
        console.error("Erreur lors de la demande d'export:", error);
        alert(
          'Une erreur est survenue. Veuillez nous contacter directement à info@msl-itech.com ' +
          "pour faire votre demande d'export de données."
        );
      })
      .finally(() => {
        this.isExporting = false;
      });
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
