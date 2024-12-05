import { Component, OnInit } from '@angular/core';
import { trigger, style, transition, animate } from '@angular/animations';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-tarifs',
  templateUrl: './tarifs.component.html',
  styleUrl: './tarifs.component.css'
})
export class TarifsComponent implements OnInit{
  activePackage: string = 'wordpress';
  userCountryCode: string = '';
  showPrices: boolean = true;
  currencySymbol: string = '';
  exchangeRate: number = 1;
  pricesUpdated: boolean = false; // Indique si les prix sont calculés

  // Packages WordPress avec le prix de base en euros
  wordpressPackages = [
    {
      title: 'Essentiel',
      description: 'Pour un site rapide et professionnel',
      basePrice: 2500,
      price: 0,
      time: 45,
      features: ['Design épuré', 'Pages clés', 'Optimisation mobile'],
    },
    {
      title: 'Intermédiaire',
      description: 'Pour un design personnalisé et des options avancées',
      basePrice: 3500,
      price: 0,
      time: 65,
      features: ['Design sur mesure', 'Contenu optimisé', 'Fonctionnalités avancées'],
    },
    {
      title: 'Premium',
      description: 'Pour les entreprises en croissance',
      basePrice: 5000,
      price: 0,
      time: 90,
      features: ['Design sur mesure', 'Intégrations complexes', 'Optimisation complète'],
    },
  ];

  // Packages JavaScript avec le prix de base en euros
  javascriptPackages = [
    {
      title: 'Essentiel',
      description: 'Pour un site rapide et adapté',
      basePrice: 3750,
      price: 0,
      time: 68,
      features: ['Développement sur mesure', 'Structure robuste', 'Design ergonomique'],
    },
    {
      title: 'Intermédiaire',
      description: 'Fonctionnalités avancées et optimisation UX',
      basePrice: 5250,
      price: 0,
      time: 98,
      features: ['Fonctionnalités avancées', 'Intégration API', 'Expérience utilisateur'],
    },
    {
      title: 'Premium',
      description: 'Pour une solution complète',
      basePrice: 7500,
      price: 0,
      time: 135,
      features: ['Développement personnalisé', 'Intégrations complexes', 'Optimisation maximale'],
    },
  ];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.getUserLocation(); // Charger la localisation de l'utilisateur
  }

  getUserLocation() {
    this.http.get<any>('https://ipapi.co/json/').subscribe(
      data => {
        this.userCountryCode = data.country_code;
        this.adjustPricing();
      },
      error => {
        console.error('Erreur lors de la géolocalisation, affichage par défaut en euros.');
        // En cas d'erreur, définir un pays par défaut
        this.userCountryCode = 'FR';
        this.adjustPricing();
      }
    );
  }

  adjustPricing() {
    const euroZoneRegex = /^(FR|DE|ES|IT|BE|NL|LU|IE|PT|GR|AT|FI|SK|SI|LV|LT|EE|CY|MT)$/;
    const americanContinentRegex = /^(US|CA|MX|BR|AR|CL|PE|CO|VE|UY|PY|BO|EC|GY|SR|GF|BZ|GT|HN|SV|NI|CR|PA|BS|CU|JM|HT|DO|PR|TT|BB|LC|GD|AG|DM|KN|VC)$/;

    if (euroZoneRegex.test(this.userCountryCode)) {
      this.currencySymbol = '€';
      this.exchangeRate = 1; // Pas de conversion, prix en euros
      this.showPrices = true;
    } else if (this.userCountryCode === 'MA') {
      this.currencySymbol = 'MAD';
      this.exchangeRate = 11; // Taux de conversion EUR -> MAD (exemple)
      this.showPrices = true;
    } else if (this.userCountryCode === 'CM') {
      this.currencySymbol = 'XAF'; // Franc CFA
      this.exchangeRate = 655.957; // Taux de conversion fixe EUR -> XAF (parité officielle)
      this.showPrices = true;
    } else if (americanContinentRegex.test(this.userCountryCode)) {
      this.currencySymbol = '$';
      this.exchangeRate = 1.5; // Taux de conversion EUR -> CAD (exemple)
      this.showPrices = true;
    } else {
      this.showPrices = false; // Ne pas afficher les prix pour les autres pays
    }

    this.updatePackagePrices();
  }

  updatePackagePrices() {
    this.wordpressPackages.forEach(pack => {
      pack.price = pack.basePrice * this.exchangeRate;
    });

    this.javascriptPackages.forEach(pack => {
      pack.price = pack.basePrice * this.exchangeRate;
    });

    this.pricesUpdated = true; // Indiquer que les prix sont prêts
  }

  switchPackage(packageType: string) {
    this.activePackage = packageType;
    this.pricesUpdated = false; // Réinitialiser le drapeau pour relancer l'animation
    setTimeout(() => {
      this.pricesUpdated = true; // Marquer les prix comme prêts après un court délai
    }, 10); // Attendre pour garantir le redémarrage de l'animation
  }
}
