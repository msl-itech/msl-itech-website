import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LanguageService {
  private currentLanguageSubject = new BehaviorSubject<string>('fr');
  public currentLanguage$ = this.currentLanguageSubject.asObservable();

  private readonly STORAGE_KEY = 'selected-language';

  constructor(private translate: TranslateService) {
    this.initializeLanguage();
  }

  private initializeLanguage(): void {
    // Récupérer la langue stockée ou utiliser la langue du navigateur
    const savedLanguage = localStorage.getItem(this.STORAGE_KEY);
    const browserLang = this.translate.getBrowserLang();

    let language = 'fr'; // Langue par défaut

    if (savedLanguage && this.isLanguageSupported(savedLanguage)) {
      language = savedLanguage;
    } else if (browserLang && this.isLanguageSupported(browserLang)) {
      language = browserLang;
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
      localStorage.setItem(this.STORAGE_KEY, language);
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
