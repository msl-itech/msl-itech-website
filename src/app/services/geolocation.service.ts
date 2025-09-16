import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface CountryInfo {
  countryCode: string;
  currency: string;
  isEuroZone: boolean;
  isMorocco: boolean;
  isNorthAmerica: boolean;
  isUnitedStates: boolean;
  isCanada: boolean;
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
    isUnitedStates: false,
    isCanada: false,
  });

  public countryInfo$ = this.countryInfoSubject.asObservable();

  constructor(private http: HttpClient) {
    this.getUserLocation();
  }

  getUserLocation() {
    this.http.get<any>('https://ipapi.co/json/').subscribe(
      (data) => {
        console.log('Réponse API géolocalisation complète:', data);

        // Essayer country_code en premier, puis country comme fallback
        const countryCode =
          this.normalizeCountryCode(data.country_code) ||
          this.normalizeCountryCode(data.country_code_iso3) ||
          this.normalizeCountryCode(data.country_name) ||
          this.normalizeCountryCode(data.country) ||
          this.normalizeCountryCode(data.currency);
        console.log('Code pays détecté:', countryCode);
        console.log('country_code:', data.country_code);
        console.log('country_code_iso3:', data.country_code_iso3);
        console.log('country_name:', data.country_name);
        console.log('country:', data.country);
        console.log('currency:', data.currency);

        if (!countryCode) {
          console.error('Aucun code pays trouvé dans la réponse API');
          const defaultCountryInfo = this.getCountryInfo('FR');
          this.countryInfoSubject.next(defaultCountryInfo);
          return;
        }

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

  private getCountryInfo(countryCode: string | null | undefined): CountryInfo {
    const normalizedCode = (countryCode ?? '').trim().toUpperCase();
    console.log('getCountryInfo appelée avec:', normalizedCode);

    const euroZoneRegex =
      /^(FR|DE|ES|IT|BE|NL|LU|IE|PT|GR|AT|FI|SK|SI|LV|LT|EE|CY|MT)$/;
    const northAmericaRegex = /^(US|CA)$/; // États-Unis et Canada

    const isEuroZone = euroZoneRegex.test(normalizedCode);
    const isMorocco = normalizedCode === 'MA';
    const isUnitedStates = normalizedCode === 'US';
    const isCanada = normalizedCode === 'CA';
    const isNorthAmerica = northAmericaRegex.test(normalizedCode);

    let currency = 'EUR'; // Défaut pour l'Europe
    if (isMorocco) {
      currency = 'MAD';
      console.log('Utilisateur marocain détecté - devise: MAD');
    } else if (isCanada) {
      currency = 'CAD';
      console.log('Utilisateur canadien détecté - devise: CAD');
    } else if (isUnitedStates) {
      currency = 'USD';
      console.log('Utilisateur américain détecté - devise: USD');
    } else if (isEuroZone) {
      currency = 'EUR';
      console.log('Utilisateur de la zone euro détecté - devise: EUR');
    } else {
      currency = 'EUR'; // Autres pays affichent en EUR par défaut
      console.log('Autre pays détecté - devise par défaut: EUR');
    }

    const result = {
      countryCode: normalizedCode,
      currency,
      isEuroZone,
      isMorocco,
      isNorthAmerica,
      isUnitedStates,
      isCanada,
    };

    console.log('Résultat getCountryInfo:', result);
    return result;
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

  isCanadianUser(): boolean {
    return this.getCurrentCountryInfo().isCanada;
  }

  // Méthode pour forcer un pays pour les tests
  forceCountry(countryCode: string): void {
    const countryInfo = this.getCountryInfo(countryCode);
    this.countryInfoSubject.next(countryInfo);
  }

  // Méthode pour simuler la réponse API complète du Maroc
  simulateMorocco(): void {
    const moroccanData = {
      ip: '160.177.149.137',
      country: 'MA',
      country_code: 'MA',
      country_name: 'Morocco',
      city: 'Meknes',
      currency: 'MAD',
    };

    console.log('Simulation avec données:', moroccanData);
    const countryCode =
      this.normalizeCountryCode(moroccanData.country_code) ||
      this.normalizeCountryCode(moroccanData.country);
    const countryInfo = this.getCountryInfo(countryCode);
    console.log('Résultat simulation Maroc:', countryInfo);
    this.countryInfoSubject.next(countryInfo);
  }

  private normalizeCountryCode(code: any): string | null {
    if (!code) {
      return null;
    }

    const trimmedCode = String(code).trim();
    if (!trimmedCode) {
      return null;
    }

    if (trimmedCode.length === 2) {
      return trimmedCode.toUpperCase();
    }

    const upperCode = trimmedCode.toUpperCase();

    const iso3ToIso2: Record<string, string> = {
      MAR: 'MA',
      USA: 'US',
      CAN: 'CA',
    };

    if (iso3ToIso2[upperCode]) {
      return iso3ToIso2[upperCode];
    }

    const nameToIso2: Record<string, string> = {
      MOROCCO: 'MA',
      MAROC: 'MA',
      'KINGDOM OF MOROCCO': 'MA',
      'ROYAUME DU MAROC': 'MA',
      'UNITED STATES': 'US',
      'UNITED STATES OF AMERICA': 'US',
      CANADA: 'CA',
    };

    if (nameToIso2[upperCode]) {
      return nameToIso2[upperCode];
    }

    const currencyToIso2: Record<string, string> = {
      MAD: 'MA',
      USD: 'US',
      CAD: 'CA',
    };

    if (currencyToIso2[upperCode]) {
      return currencyToIso2[upperCode];
    }

    return null;
  }
}
