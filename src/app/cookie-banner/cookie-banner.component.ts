import { animate, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { ConsentService } from '../services/consent.service';

@Component({
  selector: 'app-cookie-banner',
  templateUrl: './cookie-banner.component.html',
  styleUrls: ['./cookie-banner.component.css'],
  animations: [
    trigger('slideUp', [
      transition(':enter', [
        style({ transform: 'translateY(100%)', opacity: 0 }),
        animate(
          '500ms ease-out',
          style({ transform: 'translateY(0)', opacity: 1 })
        ),
      ]),
      transition(':leave', [
        animate(
          '300ms ease-in',
          style({ transform: 'translateY(100%)', opacity: 0 })
        ),
      ]),
    ]),
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms ease-out', style({ opacity: 1 })),
      ]),
      transition(':leave', [animate('200ms ease-in', style({ opacity: 0 }))]),
    ]),
  ],
})
export class CookieBannerComponent implements OnInit {
  showBanner = false;
  showCustomization = false;

  preferences = {
    essential: true, // Toujours activé
    analytics: false,
    functional: false,
  };

  constructor(private consentService: ConsentService) {}

  ngOnInit() {
    // Afficher la bannière seulement si aucun consentement n'a été donné
    this.showBanner = !this.consentService.hasGivenConsent();

    // Charger les préférences sauvegardées
    this.preferences = this.consentService.getPreferences();
  }

  acceptAll() {
    this.preferences = {
      essential: true,
      analytics: true,
      functional: true,
    };
    this.savePreferencesAndClose();
  }

  rejectAll() {
    this.preferences = {
      essential: true,
      analytics: false,
      functional: false,
    };
    this.savePreferencesAndClose();
  }

  showCustomizationModal() {
    this.showCustomization = true;
  }

  closeCustomization() {
    this.showCustomization = false;
  }

  saveCustomPreferences() {
    this.savePreferencesAndClose();
    this.closeCustomization();
  }

  private savePreferencesAndClose() {
    this.consentService.savePreferences(this.preferences);
    this.showBanner = false;

    // Activer/désactiver Google Analytics selon le consentement
    if (this.preferences.analytics) {
      this.consentService.enableAnalytics();
    } else {
      this.consentService.disableAnalytics();
    }
  }

  closeBanner() {
    // Si l'utilisateur ferme sans choisir, on considère comme refus
    this.rejectAll();
  }
}
