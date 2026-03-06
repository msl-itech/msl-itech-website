import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, DOCUMENT } from '@angular/common';
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

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    @Inject(DOCUMENT) private document: Document
  ) { }

  hasGivenConsent(): boolean {
    if (!isPlatformBrowser(this.platformId)) return false;
    return localStorage.getItem(this.CONSENT_KEY) !== null;
  }

  getPreferences(): ConsentPreferences {
    if (!isPlatformBrowser(this.platformId)) {
      return { essential: true, analytics: false, functional: false };
    }
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
    if (!isPlatformBrowser(this.platformId)) return;
    localStorage.setItem(this.CONSENT_KEY, 'true');
    localStorage.setItem(this.PREFERENCES_KEY, JSON.stringify(preferences));
    localStorage.setItem('msl_consent_date', new Date().toISOString());
  }

  enableAnalytics(): void {
    if (!isPlatformBrowser(this.platformId)) return;
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
    if (!isPlatformBrowser(this.platformId)) return;
    // Désactiver Google Analytics
    if (typeof gtag !== 'undefined') {
      gtag('consent', 'update', {
        analytics_storage: 'denied',
      });
    }
  }

  private loadGoogleAnalytics(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    // Charger Google Analytics seulement si consenti
    const preferences = this.getPreferences();
    if (preferences.analytics && !this.isGoogleAnalyticsLoaded()) {
      const script = this.document.createElement('script');
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${environment.googleAnalyticsId}`;
      this.document.head.appendChild(script);

      script.onload = () => {
        const win = window as any;
        win.dataLayer = win.dataLayer || [];
        win.gtag = function () {
          win.dataLayer.push(arguments);
        };

        win.gtag('js', new Date());
        win.gtag('config', environment.googleAnalyticsId, {
          anonymize_ip: true,
          cookie_flags: 'SameSite=Strict;Secure',
        });
      };
    }
  }

  private isGoogleAnalyticsLoaded(): boolean {
    if (!isPlatformBrowser(this.platformId)) return false;
    return (
      this.document.querySelector('script[src*="googletagmanager.com"]') !== null
    );
  }

  clearConsent(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    localStorage.removeItem(this.CONSENT_KEY);
    localStorage.removeItem(this.PREFERENCES_KEY);
    localStorage.removeItem('msl_consent_date');
  }

  getConsentDate(): Date | null {
    if (!isPlatformBrowser(this.platformId)) return null;
    const date = localStorage.getItem('msl_consent_date');
    return date ? new Date(date) : null;
  }

  // Méthode pour exporter les données utilisateur (RGPD)
  exportUserData(type: 'local' | 'complete' = 'local'): any {
    if (!isPlatformBrowser(this.platformId)) return {};
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

    return localData;
  }

  // Nouvelle méthode pour demander un export complet via email
  requestCompleteDataExport(email: string): Promise<any> {
    const requestData = {
      name: 'Demande Export RGPD',
      email_from: email,
      description: `Demande d'export complet des données personnelles selon l'article 20 du RGPD.
      
Date de la demande : ${new Date().toISOString()}
Email du demandeur : ${email}
Type de demande : Export RGPD complet
      
Cette demande doit être traitée dans un délai maximum de 30 jours conformément au RGPD.`,
      subject: 'RGPD - Demande export données personnelles',
    };

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
    if (!isPlatformBrowser(this.platformId)) return;
    if (this.getPreferences().analytics && typeof gtag !== 'undefined') {
      gtag('event', eventName, {
        ...parameters,
        anonymize_ip: true,
      });
    }
  }

  trackPageView(pagePath: string, pageTitle?: string): void {
    if (!isPlatformBrowser(this.platformId)) return;
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
    if (!isPlatformBrowser(this.platformId)) return {};
    const cookies: any = {};
    this.document.cookie.split(';').forEach((cookie) => {
      const [name, value] = cookie.trim().split('=');
      if (name) {
        cookies[name] = decodeURIComponent(value || '');
      }
    });
    return cookies;
  }

  private getLocalStorageData(): any {
    if (!isPlatformBrowser(this.platformId)) return {};
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
