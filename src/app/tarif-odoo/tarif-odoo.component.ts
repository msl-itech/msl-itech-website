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
  newClientPricing: { [key: string]: NewClientPricing } = {
    '4h': {
      usd: 190,
      mad: 1539,
    },
    '10h': {
      usd: 291.67,
      mad: 3825,
    },
    '25h': {
      usd: 977,
      mad: 7914,
    },
    '50h': {
      usd: 1904,
      mad: 15422,
    },
    '100h': {
      usd: 3400,
      mad: 27540,
    },
  };

  // Définition des prix pour les clients existants (nouveaux prix fournis)
  packagePricing: { [key: string]: PackagePricing } = {
    '4h': {
      usd: 223.53,
      mad: 1811.0,
      madWithDiscount: 1811.0, // Prix direct
      madWithTva: 1811.0, // Prix direct
    },
    '10h': {
      usd: 350, // Prix non fourni (x dans le tableau)
      mad: 4500.0,
      madWithDiscount: 4500.0, // Prix direct
      madWithTva: 4500.0, // Prix direct
    },
    '25h': {
      usd: 1150.0,
      mad: 9315.0,
      madWithDiscount: 9315.0, // Prix direct
      madWithTva: 9315.0, // Prix direct
    },
    '50h': {
      usd: 2240.0,
      mad: 18144.0,
      madWithDiscount: 18144.0, // Prix direct
      madWithTva: 18144.0, // Prix direct
    },
    '100h': {
      usd: 4000.0,
      mad: 32400.0,
      madWithDiscount: 32400.0, // Prix direct
      madWithTva: 32400.0, // Prix direct
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
      return `${roundedMadWithTva.toLocaleString('fr-FR')} MAD`;
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
          return '800 €';
        case '25h':
          return '1.750 €';
        case '50h':
          return '3.200 €';
        case '100h':
          return '6.000 €';
        default:
          return '';
      }
    }
  }

  getNewClientPrice(packageKey: string): string {
    const pricing = this.newClientPricing[packageKey];
    if (!pricing) return '';

    if (this.isMoroccanUser) {
      return `${pricing.mad.toLocaleString('fr-FR')} MAD`;
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
          return '350 €';
        case '10h':
          return '750 €';
        case '25h':
          return '1.550 €';
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
