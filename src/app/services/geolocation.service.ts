import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface CountryInfo {
  countryCode: string;
  currency: string;
  isEuroZone: boolean;
  isMorocco: boolean;
  isNorthAmerica: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class GeolocationService {
  private countryInfoSubject = new BehaviorSubject<CountryInfo>({
    countryCode: 'FR',
    currency: 'EUR',
    isEuroZone: true,
    isMorocco: false,
    isNorthAmerica: false,
  });

  public countryInfo$ = this.countryInfoSubject.asObservable();

  constructor(private http: HttpClient) {
    this.getUserLocation();
  }

  getUserLocation() {
    this.http.get<any>('https://ipapi.co/json/').subscribe(
      (data) => {
        const countryCode = data.country_code;
        const countryInfo = this.getCountryInfo(countryCode);
        this.countryInfoSubject.next(countryInfo);
      },
      (error) => {
        console.error(
          'Erreur lors de la géolocalisation, affichage par défaut en euros.',
          error
        );
        // En cas d'erreur, définir un pays par défaut (France)
        const defaultCountryInfo = this.getCountryInfo('FR');
        this.countryInfoSubject.next(defaultCountryInfo);
      }
    );
  }

  private getCountryInfo(countryCode: string): CountryInfo {
    const euroZoneRegex =
      /^(FR|DE|ES|IT|BE|NL|LU|IE|PT|GR|AT|FI|SK|SI|LV|LT|EE|CY|MT)$/;
    const northAmericaRegex = /^(US|CA)$/; // États-Unis et Canada

    const isEuroZone = euroZoneRegex.test(countryCode);
    const isMorocco = countryCode === 'MA';
    const isNorthAmerica = northAmericaRegex.test(countryCode);

    let currency = 'EUR'; // Défaut pour l'Europe
    if (isMorocco) {
      currency = 'MAD';
    } else if (isNorthAmerica) {
      currency = 'USD';
    } else if (!isEuroZone) {
      currency = 'EUR'; // Autres pays affichent en EUR par défaut
    }

    return {
      countryCode,
      currency,
      isEuroZone,
      isMorocco,
      isNorthAmerica,
    };
  }

  getCurrentCountryInfo(): CountryInfo {
    return this.countryInfoSubject.value;
  }

  isMoroccanUser(): boolean {
    return this.getCurrentCountryInfo().isMorocco;
  }

  isNorthAmericanUser(): boolean {
    return this.getCurrentCountryInfo().isNorthAmerica;
  }
}
