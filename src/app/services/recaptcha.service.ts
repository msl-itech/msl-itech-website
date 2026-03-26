import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

/**
 * Service de gestion reCAPTCHA Enterprise
 * Gère la génération de tokens reCAPTCHA avec support SSR
 */
@Injectable({
  providedIn: 'root'
})
export class RecaptchaService {
  private readonly siteKey = '6Ld59pgsAAAAAB50gGD8ei7IfKUPhsr9WyYPIro-';
  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  /**
   * Génère un token reCAPTCHA pour une action donnée
   * @param action - L'action à valider (ex: 'contact_form', 'option_form')
   * @returns Promise<string> - Le token reCAPTCHA ou une chaîne vide si échec
   */
  async executeRecaptcha(action: string): Promise<string> {
    // Ne s'exécute que côté client (navigateur)
    if (!this.isBrowser) {
      console.warn('[reCAPTCHA] Tentative d\'exécution côté serveur - ignoré');
      return '';
    }

    try {
      // Vérifier que grecaptcha.enterprise est disponible
      if (typeof (window as any).grecaptcha === 'undefined' ||
          typeof (window as any).grecaptcha.enterprise === 'undefined') {
        console.error('[reCAPTCHA] API reCAPTCHA Enterprise non chargée');
        return '';
      }

      // Attendre que reCAPTCHA soit prêt
      await this.waitForRecaptcha();

      // Exécuter reCAPTCHA et obtenir le token
      const token = await (window as any).grecaptcha.enterprise.execute(
        this.siteKey,
        { action }
      );

      return token;
    } catch (error) {
      console.error('[reCAPTCHA] Erreur lors de la génération du token:', error);
      return '';
    }
  }

  /**
   * Attend que reCAPTCHA soit complètement chargé et prêt
   * @param maxRetries - Nombre maximum de tentatives
   * @param retryDelay - Délai entre chaque tentative en ms
   * @returns Promise<void>
   */
  private waitForRecaptcha(maxRetries = 50, retryDelay = 100): Promise<void> {
    return new Promise((resolve, reject) => {
      let attempts = 0;

      const checkRecaptcha = () => {
        attempts++;

        if (typeof (window as any).grecaptcha !== 'undefined' &&
            typeof (window as any).grecaptcha.enterprise !== 'undefined' &&
            typeof (window as any).grecaptcha.enterprise.execute === 'function') {
          resolve();
          return;
        }

        if (attempts >= maxRetries) {
          reject(new Error('reCAPTCHA n\'a pas pu être chargé après ' + maxRetries + ' tentatives'));
          return;
        }

        setTimeout(checkRecaptcha, retryDelay);
      };

      checkRecaptcha();
    });
  }

  /**
   * Réinitialise le widget reCAPTCHA
   * Utile après une erreur de soumission de formulaire
   */
  resetRecaptcha(): void {
    if (!this.isBrowser) {
      return;
    }

    try {
      if (typeof (window as any).grecaptcha !== 'undefined' &&
          typeof (window as any).grecaptcha.enterprise !== 'undefined' &&
          typeof (window as any).grecaptcha.enterprise.reset === 'function') {
        (window as any).grecaptcha.enterprise.reset();
      }
    } catch (error) {
      console.error('[reCAPTCHA] Erreur lors de la réinitialisation:', error);
    }
  }

  /**
   * Vérifie si reCAPTCHA est disponible
   * @returns boolean - true si reCAPTCHA est disponible
   */
  isRecaptchaAvailable(): boolean {
    if (!this.isBrowser) {
      return false;
    }

    return typeof (window as any).grecaptcha !== 'undefined' &&
           typeof (window as any).grecaptcha.enterprise !== 'undefined';
  }
}
