import { Component, OnInit } from '@angular/core';
import { LanguageService } from '../services/language.service';

@Component({
  selector: 'app-language-selector',
  templateUrl: './language-selector.component.html',
  styleUrls: ['./language-selector.component.css'],
})
export class LanguageSelectorComponent implements OnInit {
  currentLanguage: string = 'fr';
  supportedLanguages: { code: string; name: string }[] = [];

  constructor(private languageService: LanguageService) {}

  ngOnInit(): void {
    this.supportedLanguages = this.languageService.getSupportedLanguages();

    // S'abonner aux changements de langue
    this.languageService.currentLanguage$.subscribe((lang) => {
      this.currentLanguage = lang;
    });
  }

  onLanguageChange(language: string): void {
    this.languageService.setLanguage(language);
  }

  toggleLanguage(): void {
    this.languageService.toggleLanguage();
  }
}
