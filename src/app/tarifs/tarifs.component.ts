import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
@Component({
  selector: 'app-tarifs',
  templateUrl: './tarifs.component.html',
  styleUrl: './tarifs.component.css',
})
export class TarifsComponent implements OnInit {
  activePackage: string = 'wordpress';
  userCountryCode: string = '';
  showPrices: boolean = true;
  currencySymbol: string = '';
  exchangeRate: number = 1;
  pricesUpdated: boolean = false;
  currentCurrency: string = 'EUR';

  // Prix de base pour la nouvelle interface de comparaison (en EUR)
  basePricesComparison = {
    wp: [900, 2000, 4500], // WordPress : Basique, Pro, Business
    js: [3750, 5250, 7500], // JavaScript : Basique, Pro, Business
  };

  // Taux de change
  exchangeRates = {
    EUR: 1,
    USD: 1.1,
    CAD: 1.5,
    MAD: 11.5,
    XAF: 655.957,
  };

  // Symboles des devises
  currencySymbols = {
    EUR: '€',
    USD: '$',
    CAD: 'CAD$',
    MAD: 'DH',
    XAF: 'XAF',
  };

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
      features: [
        'Design sur mesure',
        'Contenu optimisé',
        'Fonctionnalités avancées',
      ],
    },
    {
      title: 'Premium',
      description: 'Pour les entreprises en croissance',
      basePrice: 5000,
      price: 0,
      time: 90,
      features: [
        'Design sur mesure',
        'Intégrations complexes',
        'Optimisation complète',
      ],
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
      features: [
        'Développement sur mesure',
        'Structure robuste',
        'Design ergonomique',
      ],
    },
    {
      title: 'Intermédiaire',
      description: 'Fonctionnalités avancées et optimisation UX',
      basePrice: 5250,
      price: 0,
      time: 98,
      features: [
        'Fonctionnalités avancées',
        'Intégration API',
        'Expérience utilisateur',
      ],
    },
    {
      title: 'Premium',
      description: 'Pour une solution complète',
      basePrice: 7500,
      price: 0,
      time: 135,
      features: [
        'Développement personnalisé',
        'Intégrations complexes',
        'Optimisation maximale',
      ],
    },
  ];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.getUserLocation(); // Charger la localisation de l'utilisateur

    // Écouter les événements de changement de devise manuel
    document.addEventListener('currencyChanged', (event: any) => {
      this.changeCurrency(event.detail.currency);
    });
  }

  getUserLocation() {
    this.http.get<any>('https://ipapi.co/json/').subscribe(
      (data) => {
        this.userCountryCode = data.country_code;
        this.adjustPricing();
      },
      (error) => {
        console.error(
          'Erreur lors de la géolocalisation, affichage par défaut en euros.'
        );
        // En cas d'erreur, définir un pays par défaut
        this.userCountryCode = 'FR';
        this.adjustPricing();
      }
    );
  }

  adjustPricing() {
    const euroZoneRegex =
      /^(FR|DE|ES|IT|BE|NL|LU|IE|PT|GR|AT|FI|SK|SI|LV|LT|EE|CY|MT)$/;
    const americanContinentRegex =
      /^(US|CA|MX|BR|AR|CL|PE|CO|VE|UY|PY|BO|EC|GY|SR|GF|BZ|GT|HN|SV|NI|CR|PA|BS|CU|JM|HT|DO|PR|TT|BB|LC|GD|AG|DM|KN|VC)$/;

    if (euroZoneRegex.test(this.userCountryCode)) {
      this.currentCurrency = 'EUR';
      this.currencySymbol = '€';
      this.exchangeRate = 1;
      this.showPrices = true;
    } else if (this.userCountryCode === 'MA') {
      this.currentCurrency = 'MAD';
      this.currencySymbol = 'DH';
      this.exchangeRate = 11.5;
      this.showPrices = true;
    } else if (this.userCountryCode === 'CM') {
      this.currentCurrency = 'XAF';
      this.currencySymbol = 'XAF';
      this.exchangeRate = 655.957;
      this.showPrices = true;
    } else if (americanContinentRegex.test(this.userCountryCode)) {
      if (this.userCountryCode === 'US') {
        this.currentCurrency = 'USD';
        this.currencySymbol = '$';
        this.exchangeRate = 1.1;
      } else {
        this.currentCurrency = 'CAD';
        this.currencySymbol = 'CAD$';
        this.exchangeRate = 1.5;
      }
      this.showPrices = true;
    } else {
      this.showPrices = false;
    }

    this.updatePackagePrices();
    this.updateComparisonPrices();
  }

  updatePackagePrices() {
    this.wordpressPackages.forEach((pack) => {
      pack.price = pack.basePrice * this.exchangeRate;
    });

    this.javascriptPackages.forEach((pack) => {
      pack.price = pack.basePrice * this.exchangeRate;
    });

    this.pricesUpdated = true;
  }

  updateComparisonPrices() {
    // Attendre que le DOM soit chargé
    setTimeout(() => {
      this.setActiveCurrencyButton();
      this.updatePricesInComparison();

      // Déclencher l'événement pour les animations
      const event = new CustomEvent('currencyChanged', {
        detail: { currency: this.currentCurrency },
      });
      document.dispatchEvent(event);
    }, 100);
  }

  setActiveCurrencyButton() {
    // Supprimer la classe active de tous les boutons
    const buttons = document.querySelectorAll('.currency-btn');
    buttons.forEach((btn) => btn.classList.remove('active'));

    // Ajouter la classe active au bouton correspondant
    const activeButton = document.querySelector(
      `[data-currency="${this.currentCurrency}"]`
    );
    if (activeButton) {
      activeButton.classList.add('active');
    }
  }

  updatePricesInComparison() {
    const rate = this.exchangeRate;
    const symbol = this.currencySymbol;

    // Mettre à jour les symboles de devise
    document.querySelectorAll('.currency-symbol').forEach((el) => {
      el.textContent = symbol;
    });

    // Mettre à jour les prix WordPress
    document.querySelectorAll('[data-wp-price]').forEach((el, index) => {
      const basePrice = this.basePricesComparison.wp[index];
      const convertedPrice = Math.round(basePrice * rate);
      const formattedPrice = this.formatPrice(convertedPrice);
      el.innerHTML = `${formattedPrice}<span class="currency-symbol">${symbol}</span>`;
    });

    // Mettre à jour les prix JavaScript
    document.querySelectorAll('[data-js-price]').forEach((el, index) => {
      const basePrice = this.basePricesComparison.js[index];
      const convertedPrice = Math.round(basePrice * rate);
      const formattedPrice = this.formatPrice(convertedPrice);
      el.innerHTML = `${formattedPrice}<span class="currency-symbol">${symbol}</span>`;
    });

    // Mettre à jour les pourcentages de différence
    this.updatePercentageDifferences();
  }

  formatPrice(price: number): string {
    return price.toLocaleString('fr-FR');
  }

  updatePercentageDifferences() {
    const wpPrices = this.basePricesComparison.wp;
    const jsPrices = this.basePricesComparison.js;

    const differences = document.querySelectorAll('.price-difference');
    differences.forEach((el, index) => {
      const text = el.textContent;
      if (text && text.includes('vs WordPress')) {
        const wpPrice = wpPrices[index];
        const jsPrice = jsPrices[index];
        const percentage = Math.round(((jsPrice - wpPrice) / wpPrice) * 100);
        el.textContent = `+${percentage}% vs WordPress`;
      }
    });
  }

  switchPackage(packageType: string) {
    this.activePackage = packageType;
    this.pricesUpdated = false;
    setTimeout(() => {
      this.pricesUpdated = true;
    }, 10);
  }

  // Méthode pour changer manuellement la devise (si l'utilisateur clique sur un bouton)
  changeCurrency(currency: string) {
    this.currentCurrency = currency;
    this.currencySymbol =
      this.currencySymbols[currency as keyof typeof this.currencySymbols];
    this.exchangeRate =
      this.exchangeRates[currency as keyof typeof this.exchangeRates];

    this.updatePackagePrices();
    this.updateComparisonPrices();
  }

  // Méthode pour obtenir le nom du pays
  getCountryName(countryCode: string): string {
    const countryNames: { [key: string]: string } = {
      FR: 'France',
      DE: 'Allemagne',
      ES: 'Espagne',
      IT: 'Italie',
      BE: 'Belgique',
      NL: 'Pays-Bas',
      LU: 'Luxembourg',
      IE: 'Irlande',
      PT: 'Portugal',
      GR: 'Grèce',
      AT: 'Autriche',
      FI: 'Finlande',
      SK: 'Slovaquie',
      SI: 'Slovénie',
      LV: 'Lettonie',
      LT: 'Lituanie',
      EE: 'Estonie',
      CY: 'Chypre',
      MT: 'Malte',
      US: 'États-Unis',
      CA: 'Canada',
      MA: 'Maroc',
      CM: 'Cameroun',
      MX: 'Mexique',
      BR: 'Brésil',
      AR: 'Argentine',
    };
    return countryNames[countryCode] || countryCode;
  }

  // Méthode pour obtenir le nom de la devise
  getCurrencyName(currencyCode: string): string {
    const currencyNames: { [key: string]: string } = {
      EUR: 'Euro',
      USD: 'Dollar US',
      CAD: 'Dollar Canadien',
      MAD: 'Dirham',
      XAF: 'Franc CFA',
    };
    return currencyNames[currencyCode] || currencyCode;
  }
}
