import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GeolocationService } from '../services/geolocation.service';

interface PackagePricing {
  usd: number;
  mad: number;
  madWithDiscount: number;
  madWithTva: number;
}

interface NewClientPricing {
  usd: number;
  mad: number;
}

@Component({
  selector: 'app-tarif-odoo',
  templateUrl: './tarif-odoo.component.html',
  styleUrl: './tarif-odoo.component.css',
})
export class TarifOdooComponent implements OnInit {
  isMoroccanUser: boolean = false;
  isNorthAmericanUser: boolean = false;
  isCanadianUser: boolean = false;
  private readonly usdToCadRate = 1.5;

  // Définition des prix pour les nouveaux clients (anciens prix du système)
  // Prix USD = Prix EUR × 1.10
  newClientPricing: { [key: string]: NewClientPricing } = {
    '4h': {
      usd: 440, // 400 € × 1.10
      mad: 1539,
    },
    '10h': {
      usd: 990, // 900 € × 1.10
      mad: 3825,
    },
    '25h': {
      usd: 2200, // 2000 € × 1.10
      mad: 7914,
    },
    '50h': {
      usd: 3850, // 3500 € × 1.10
      mad: 15422,
    },
    '100h': {
      usd: 5940, // 5400 € × 1.10
      mad: 27540,
    },
    '200h': {
      usd: 9350, // 8500 € × 1.10
      mad: 51000,
    },
  };

  // Définition des prix pour les clients existants (nouveaux prix fournis)
  // Prix USD = Prix EUR × 1.10
  packagePricing: { [key: string]: PackagePricing } = {
    '4h': {
      usd: 440, // 400 € × 1.10
      mad: 1811.0,
      madWithDiscount: 1811.0, // Prix direct
      madWithTva: 1811.0, // Prix direct
    },
    '10h': {
      usd: 990, // 900 € × 1.10
      mad: 4500.0,
      madWithDiscount: 4500.0, // Prix direct
      madWithTva: 4500.0, // Prix direct
    },
    '25h': {
      usd: 2200, // 2000 € × 1.10
      mad: 9315.0,
      madWithDiscount: 9315.0, // Prix direct
      madWithTva: 9315.0, // Prix direct
    },
    '50h': {
      usd: 3850, // 3500 € × 1.10
      mad: 18144.0,
      madWithDiscount: 18144.0, // Prix direct
      madWithTva: 18144.0, // Prix direct
    },
    '100h': {
      usd: 6600, // 6000 € × 1.10
      mad: 32400.0,
      madWithDiscount: 32400.0, // Prix direct
      madWithTva: 32400.0, // Prix direct
    },
    '200h': {
      usd: 11000, // 10000 € × 1.10
      mad: 60000.0,
      madWithDiscount: 60000.0, // Prix direct
      madWithTva: 60000.0, // Prix direct
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
      this.isCanadianUser = countryInfo.isCanada;
      this.isNorthAmericanUser =
        countryInfo.isNorthAmerica && !countryInfo.isCanada;
    });
  }

  goToRendezVous(): void {
    this.router.navigate(['/prendre-rendez-vous']);
  }

  getPrice(packageKey: string): string {
    const pricing = this.packagePricing[packageKey];
    if (!pricing) return '';

    if (this.isMoroccanUser) {
      const roundedMadWithTva = Math.round(pricing.madWithTva);
      const formattedPrice = roundedMadWithTva.toLocaleString('fr-FR').replace(/\s/g, '.');
      return `${formattedPrice} MAD`;
    } else if (this.isCanadianUser) {
      if (pricing.usd === 0) {
        return 'x'; // Prix non disponible
      }
      const cadAmount = pricing.usd * this.usdToCadRate;
      const formattedCad = cadAmount.toLocaleString('en-CA', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });

      return `${formattedCad} CAD`;
    } else if (this.isNorthAmericanUser) {
      if (pricing.usd === 0) {
        return 'x'; // Prix non disponible
      }
      return `$${pricing.usd.toLocaleString('en-US')} USD`;
    } else {
      // Prix européens pour clients existants
      switch (packageKey) {
        case '4h':
          return '400 €';
        case '10h':
          return '900 €';
        case '25h':
          return '2.000 €';
        case '50h':
          return '3.500 €';
        case '100h':
          return '6.000 €';
        case '200h':
          return '10.000 €';
        default:
          return '';
      }
    }
  }

  getNewClientPrice(packageKey: string): string {
    const pricing = this.newClientPricing[packageKey];
    if (!pricing) return '';

    if (this.isMoroccanUser) {
      const formattedPrice = pricing.mad.toLocaleString('fr-FR').replace(/\s/g, '.');
      return `${formattedPrice} MAD`;
    } else if (this.isCanadianUser) {
      const cadAmount = pricing.usd * this.usdToCadRate;
      const formattedCad = cadAmount.toLocaleString('en-CA', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
      return `${formattedCad} CAD`;
    } else if (this.isNorthAmericanUser) {
      return `$${pricing.usd.toLocaleString('en-US')} USD`;
    } else {
      // Prix européens pour les nouveaux clients (anciens prix du système)
      switch (packageKey) {
        case '4h':
          return '400 €';
        case '10h':
          return '900 €';
        case '25h':
          return '2.000 €';
        case '50h':
          return '3.500 €';
        case '100h':
          return '5.400 €';
        case '200h':
          return '8.500 €';
        default:
          return '';
      }
    }
  }
}
