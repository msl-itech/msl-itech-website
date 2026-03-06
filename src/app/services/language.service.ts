import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LanguageService {
  private currentLanguageSubject = new BehaviorSubject<string>('fr');
  public currentLanguage$ = this.currentLanguageSubject.asObservable();

  private readonly STORAGE_KEY = 'selected-language';

  constructor(
    private translate: TranslateService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.initializeLanguage();
  }

  private initializeLanguage(): void {
    let language = 'fr'; // Langue par défaut

    if (isPlatformBrowser(this.platformId)) {
      // Récupérer la langue stockée ou utiliser la langue du navigateur
      const savedLanguage = localStorage.getItem(this.STORAGE_KEY);
      const browserLang = this.translate.getBrowserLang();

      if (savedLanguage && this.isLanguageSupported(savedLanguage)) {
        language = savedLanguage;
      } else if (browserLang && this.isLanguageSupported(browserLang)) {
        language = browserLang;
      }
    }

    this.setLanguage(language);
  }

  private isLanguageSupported(lang: string): boolean {
    return ['fr', 'en'].includes(lang);
  }

  public setLanguage(language: string): void {
    if (this.isLanguageSupported(language)) {
      this.translate.use(language);
      this.currentLanguageSubject.next(language);
      // Sauvegarder uniquement côté browser
      if (isPlatformBrowser(this.platformId)) {
        localStorage.setItem(this.STORAGE_KEY, language);
      }
    }
  }

  public getCurrentLanguage(): string {
    return this.currentLanguageSubject.value;
  }

  public getSupportedLanguages(): { code: string; name: string }[] {
    return [
      { code: 'fr', name: 'Français' },
      { code: 'en', name: 'English' },
    ];
  }

  public toggleLanguage(): void {
    const currentLang = this.getCurrentLanguage();
    const newLang = currentLang === 'fr' ? 'en' : 'fr';
    this.setLanguage(newLang);
  }
}
