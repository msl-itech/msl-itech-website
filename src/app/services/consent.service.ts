import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

// Déclaration pour gtag (Google Analytics)
declare let gtag: Function;

export interface ConsentPreferences {
  essential: boolean;
  analytics: boolean;
  functional: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class ConsentService {
  private readonly CONSENT_KEY = 'msl_cookie_consent';
  private readonly PREFERENCES_KEY = 'msl_cookie_preferences';

  constructor() {}

  hasGivenConsent(): boolean {
    return localStorage.getItem(this.CONSENT_KEY) !== null;
  }

  getPreferences(): ConsentPreferences {
    const saved = localStorage.getItem(this.PREFERENCES_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
    return {
      essential: true,
      analytics: false,
      functional: false,
    };
  }

  savePreferences(preferences: ConsentPreferences): void {
    localStorage.setItem(this.CONSENT_KEY, 'true');
    localStorage.setItem(this.PREFERENCES_KEY, JSON.stringify(preferences));
    localStorage.setItem('msl_consent_date', new Date().toISOString());
  }

  enableAnalytics(): void {
    // Activer Google Analytics
    if (typeof gtag !== 'undefined') {
      gtag('consent', 'update', {
        analytics_storage: 'granted',
      });
    }

    // Réactiver le script GA s'il était désactivé
    this.loadGoogleAnalytics();
  }

  disableAnalytics(): void {
    // Désactiver Google Analytics
    if (typeof gtag !== 'undefined') {
      gtag('consent', 'update', {
        analytics_storage: 'denied',
      });
    }
  }

  private loadGoogleAnalytics(): void {
    // Charger Google Analytics seulement si consenti
    const preferences = this.getPreferences();
    if (preferences.analytics && !this.isGoogleAnalyticsLoaded()) {
      const script = document.createElement('script');
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${environment.googleAnalyticsId}`;
      document.head.appendChild(script);

      script.onload = () => {
        (window as any).dataLayer = (window as any).dataLayer || [];
        (window as any).gtag = function () {
          (window as any).dataLayer.push(arguments);
        };

        (window as any).gtag('js', new Date());
        (window as any).gtag('config', environment.googleAnalyticsId, {
          anonymize_ip: true,
          cookie_flags: 'SameSite=Strict;Secure',
        });
      };
    }
  }

  private isGoogleAnalyticsLoaded(): boolean {
    return (
      document.querySelector('script[src*="googletagmanager.com"]') !== null
    );
  }

  clearConsent(): void {
    localStorage.removeItem(this.CONSENT_KEY);
    localStorage.removeItem(this.PREFERENCES_KEY);
    localStorage.removeItem('msl_consent_date');
  }

  getConsentDate(): Date | null {
    const date = localStorage.getItem('msl_consent_date');
    return date ? new Date(date) : null;
  }

  // Méthode pour exporter les données utilisateur (RGPD)
  exportUserData(type: 'local' | 'complete' = 'local'): any {
    const preferences = this.getPreferences();
    const consentDate = this.getConsentDate();

    const localData = {
      consent: {
        given: this.hasGivenConsent(),
        date: consentDate?.toISOString(),
        preferences: preferences,
      },
      cookies: this.getAllCookies(),
      localStorage: this.getLocalStorageData(),
      metadata: {
        exportDate: new Date().toISOString(),
        userAgent: navigator.userAgent,
        language: navigator.language,
        exportType: type,
      },
    };

    if (type === 'local') {
      return localData;
    }

    // Pour l'export complet, on retourne les données locales
    // L'export serveur sera géré séparément via une API
    return localData;
  }

  // Nouvelle méthode pour demander un export complet via email
  requestCompleteDataExport(email: string): Promise<any> {
    // Utiliser l'API Odoo existante pour créer un lead spécial pour la demande d'export
    const requestData = {
      name: 'Demande Export RGPD',
      email_from: email,
      description: `Demande d'export complet des données personnelles selon l'article 20 du RGPD.
      
Date de la demande : ${new Date().toISOString()}
Email du demandeur : ${email}
Type de demande : Export RGPD complet
      
Cette demande doit être traitée dans un délai maximum de 30 jours conformément au RGPD.`,
      // Ajouter un marqueur pour identifier les demandes RGPD
      subject: 'RGPD - Demande export données personnelles',
    };

    // Utiliser l'environnement Odoo existant
    return fetch('https://api-connect-odoo.vercel.app/api/leads', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-signature':
          '5174f6fd0d8fe45fcaf24205701d7823864bc6aa5be8fa1d81cefe718dab784d',
        'x-client-id': 'client_mslitech',
      },
      body: JSON.stringify(requestData),
    }).then((response) => {
      if (!response.ok) {
        throw new Error("Erreur lors de l'envoi de la demande");
      }
      return response.json();
    });
  }

  // Nouvelles méthodes de tracking
  trackEvent(eventName: string, parameters?: any): void {
    if (this.getPreferences().analytics && typeof gtag !== 'undefined') {
      gtag('event', eventName, {
        ...parameters,
        anonymize_ip: true,
      });
    }
  }

  trackPageView(pagePath: string, pageTitle?: string): void {
    if (this.getPreferences().analytics && typeof gtag !== 'undefined') {
      gtag('config', environment.googleAnalyticsId, {
        page_path: pagePath,
        page_title: pageTitle,
        anonymize_ip: true,
      });
    }
  }

  trackFormSubmission(formName: string, success: boolean = true): void {
    this.trackEvent('form_submit', {
      form_name: formName,
      success: success ? 'true' : 'false',
    });
  }

  private getAllCookies(): any {
    const cookies: any = {};
    document.cookie.split(';').forEach((cookie) => {
      const [name, value] = cookie.trim().split('=');
      if (name) {
        cookies[name] = decodeURIComponent(value || '');
      }
    });
    return cookies;
  }

  private getLocalStorageData(): any {
    const data: any = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('msl_')) {
        data[key] = localStorage.getItem(key);
      }
    }
    return data;
  }
}
