import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GeolocationService } from '../services/geolocation.service';

interface PackagePricing {
  usd: number;
  mad: number;
  madWithDiscount: number;
  madWithTva: number;
}

@Component({
  selector: 'app-tarif-odoo',
  templateUrl: './tarif-odoo.component.html',
  styleUrl: './tarif-odoo.component.css',
})
export class TarifOdooComponent implements OnInit {
  isMoroccanUser: boolean = false;
  isNorthAmericanUser: boolean = false;

  // Définition des prix selon le tableau fourni
  packagePricing: { [key: string]: PackagePricing } = {
    '4h': {
      usd: 190,
      mad: 1710, // 190 * 9
      madWithDiscount: 1282.5, // 1710 * 0.75 (25% de réduction)
      madWithTva: 1539.0, // 1282.50 * 1.20 (TVA 20%)
    },
    '10h': {
      usd: 291.67, // Calculé à partir du prix MAD final : 3500 MAD / 12 (9 * 1.33 pour conversion + taxes)
      mad: 2625,
      madWithDiscount: 2916.67, // Valeur donnée dans le tableau
      madWithTva: 3500.0, // 2916.67 * 1.20
    },
    '25h': {
      usd: 977,
      mad: 8793, // 977 * 9
      madWithDiscount: 6594.75, // 8793 * 0.75
      madWithTva: 7913.7, // 6594.75 * 1.20
    },
    '50h': {
      usd: 1904,
      mad: 17136, // 1904 * 9
      madWithDiscount: 12852.0, // 17136 * 0.75
      madWithTva: 15422.4, // 12852.00 * 1.20
    },
    '100h': {
      usd: 3400,
      mad: 30600, // 3400 * 9
      madWithDiscount: 22950.0, // 30600 * 0.75
      madWithTva: 27540.0, // 22950.00 * 1.20
    },
  };

  constructor(
    private router: Router,
    private geolocationService: GeolocationService
  ) {}

  ngOnInit(): void {
    this.geolocationService.countryInfo$.subscribe((countryInfo) => {
      console.log('CountryInfo reçu dans tarif-odoo:', countryInfo);
      this.isMoroccanUser = countryInfo.isMorocco;
      this.isNorthAmericanUser = countryInfo.isNorthAmerica;
      console.log('Variables mises à jour:', {
        isMoroccanUser: this.isMoroccanUser,
        isNorthAmericanUser: this.isNorthAmericanUser,
      });
    });

    // Exposer les méthodes de test dans la console pour faciliter les tests
    if (typeof window !== 'undefined') {
      (window as any).testPricing = {
        morocco: () => this.testMorocco(),
        usa: () => this.testUSA(),
        france: () => this.testFrance(),
        currentInfo: () =>
          console.log(
            'Info actuelle:',
            this.geolocationService.getCurrentCountryInfo()
          ),
        prices: () => {
          console.log('Prix actuels:');
          ['4h', '10h', '25h', '50h', '100h'].forEach((pack) => {
            console.log(`${pack}: ${this.getPrice(pack)}`);
          });
        },
      };
      console.log(
        '🧪 Méthodes de test disponibles:',
        '\n- testPricing.morocco() : Tester prix Maroc',
        '\n- testPricing.usa() : Tester prix USA',
        '\n- testPricing.france() : Tester prix France',
        '\n- testPricing.currentInfo() : Info pays actuel',
        '\n- testPricing.prices() : Afficher tous les prix actuels'
      );
    }
  }

  goToRendezVous(): void {
    this.router.navigate(['/prendre-rendez-vous']);
  }

  // Méthodes de test pour la console
  testMorocco(): void {
    console.log('🇲🇦 Test: Simulation utilisateur marocain');
    this.geolocationService.simulateMorocco();
  }

  testUSA(): void {
    console.log('🇺🇸 Test: Simulation utilisateur américain');
    this.geolocationService.forceCountry('US');
  }

  testFrance(): void {
    console.log('🇫🇷 Test: Simulation utilisateur français');
    this.geolocationService.forceCountry('FR');
  }

  getPrice(packageKey: string): string {
    const pricing = this.packagePricing[packageKey];
    if (!pricing) return '';

    console.log(`getPrice(${packageKey}) appelée avec:`, {
      isMoroccanUser: this.isMoroccanUser,
      isNorthAmericanUser: this.isNorthAmericanUser,
      pricing: pricing,
    });

    if (this.isMoroccanUser) {
      console.log(
        `Retour prix MAD pour ${packageKey}:`,
        `${pricing.madWithTva.toLocaleString('fr-FR')} MAD`
      );
      return `${pricing.madWithTva.toLocaleString('fr-FR')} MAD`;
    } else if (this.isNorthAmericanUser) {
      console.log(
        `Retour prix USD pour ${packageKey}:`,
        `$${pricing.usd.toLocaleString('en-US')} USD`
      );
      return `$${pricing.usd.toLocaleString('en-US')} USD`;
    } else {
      console.log(`Retour prix EUR pour ${packageKey}`);
      // Prix européens existants (à conserver)
      switch (packageKey) {
        case '4h':
          return '350 €';
        case '10h':
          return '750 €';
        case '25h':
          return '1 550 €';
        case '50h':
          return '2.750 €';
        case '100h':
          return '5.000 €';
        default:
          return '';
      }
    }
  }
}
