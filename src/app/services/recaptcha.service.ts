import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

/**
 * Service de gestion reCAPTCHA v2
 * Gère le widget reCAPTCHA avec case à cocher
 */
@Injectable({
  providedIn: 'root'
})
export class RecaptchaService {
  readonly siteKey = '6Ld59pgsAAAAAB50gGD8ei7IfKUPhsr9WyYPIro-';
  private isBrowser: boolean;
  private widgetId: number | null = null;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  /**
   * Rend le widget reCAPTCHA dans un élément du DOM
   * @param elementId - ID de l'élément DOM où rendre le widget
   * @returns Promise<number> - ID du widget ou -1 si échec
   */
  async renderRecaptcha(elementId: string): Promise<number> {
    if (!this.isBrowser) {
      return -1;
    }

    try {
      await this.waitForRecaptcha();

      const element = document.getElementById(elementId);
      if (!element) {
        console.error(`[reCAPTCHA] Élément ${elementId} non trouvé`);
        return -1;
      }

      this.widgetId = (window as any).grecaptcha.render(elementId, {
        sitekey: this.siteKey,
        theme: 'light',
        size: 'normal'
      });

      return this.widgetId;
    } catch (error) {
      console.error('[reCAPTCHA] Erreur lors du rendu:', error);
      return -1;
    }
  }

  /**
   * Récupère la réponse (token) du widget reCAPTCHA
   * @returns string - Le token reCAPTCHA ou chaîne vide
   */
  getResponse(): string {
    if (!this.isBrowser) {
      return '';
    }

    try {
      if (typeof (window as any).grecaptcha === 'undefined') {
        return '';
      }

      const response = (window as any).grecaptcha.getResponse(this.widgetId);
      return response || '';
    } catch (error) {
      console.error('[reCAPTCHA] Erreur lors de la récupération de la réponse:', error);
      return '';
    }
  }

  /**
   * Attend que reCAPTCHA soit complètement chargé
   */
  private waitForRecaptcha(maxRetries = 50, retryDelay = 100): Promise<void> {
    return new Promise((resolve, reject) => {
      let attempts = 0;

      const checkRecaptcha = () => {
        attempts++;

        if (typeof (window as any).grecaptcha !== 'undefined' &&
            typeof (window as any).grecaptcha.render === 'function') {
          resolve();
          return;
        }

        if (attempts >= maxRetries) {
          reject(new Error('reCAPTCHA n\'a pas pu être chargé'));
          return;
        }

        setTimeout(checkRecaptcha, retryDelay);
      };

      checkRecaptcha();
    });
  }

  /**
   * Réinitialise le widget reCAPTCHA
   */
  resetRecaptcha(): void {
    if (!this.isBrowser || this.widgetId === null) {
      return;
    }

    try {
      if (typeof (window as any).grecaptcha !== 'undefined') {
        (window as any).grecaptcha.reset(this.widgetId);
      }
    } catch (error) {
      console.error('[reCAPTCHA] Erreur lors de la réinitialisation:', error);
    }
  }
}
