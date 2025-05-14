import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { iframeResizer } from 'iframe-resizer';

@Component({
  selector: 'app-job',
  templateUrl: './job.component.html',
  styleUrls: ['./job.component.css'],
})
export class JobComponent implements AfterViewInit, OnDestroy {
  @ViewChild('jobIframe', { static: true })
  iframeRef!: ElementRef<HTMLIFrameElement>;
  iframeResizer: any; // Pour stocker l'instance du resizer

  ngAfterViewInit(): void {
    // Court délai pour assurer que la page soit prête
    setTimeout(() => {
      this.initializeResizer();
    }, 100);
  }

  ngOnDestroy(): void {
    // Nettoyage du resizer quand le composant est détruit
    if (this.iframeResizer && this.iframeResizer.close) {
      this.iframeResizer.close();
    }
  }

  private initializeResizer(): void {
    try {
      console.log('Initialisation du iframe resizer...');
      // Configuration optimisée pour la fluidité
      this.iframeResizer = iframeResizer(
        {
          log: false, // Désactiver les logs en production
          checkOrigin: false,
          heightCalculationMethod: 'bodyOffset', // Méthode plus fluide
          sizeWidth: true, // Gérer également la largeur
          autoResize: true,
          scrolling: 'auto', // Permettre le défilement naturel
          inPageLinks: true,
          warningTimeout: 0, // Désactiver le timeout d'avertissement
          bodyMargin: 0, // Pas de marge pour le corps
          bodyPadding: 0, // Pas de padding pour le corps
          tolerance: 0, // Tolérance minimale pour les changements
          onResized: function () {
            // Callback quand redimensionné
            console.log('iframe redimensionné');
          },
          onInit: function () {
            console.log('iframe initialisé');
          },
        },
        this.iframeRef.nativeElement
      );
    } catch (error) {
      console.error(
        "Erreur lors de l'initialisation du iframe resizer:",
        error
      );
    }
  }
}
