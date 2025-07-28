import { Injectable } from '@angular/core';

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
      script.src =
        'https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID';
      document.head.appendChild(script);

      script.onload = () => {
        (window as any).dataLayer = (window as any).dataLayer || [];
        (window as any).gtag = function () {
          (window as any).dataLayer.push(arguments);
        };

        (window as any).gtag('js', new Date());
        (window as any).gtag('config', 'GA_MEASUREMENT_ID', {
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
  exportUserData(): any {
    const preferences = this.getPreferences();
    const consentDate = this.getConsentDate();

    return {
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
      },
    };
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
