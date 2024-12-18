import { Component } from '@angular/core';
import { interval } from 'rxjs';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-code-promo',
  templateUrl: './code-promo.component.html',
  styleUrl: './code-promo.component.css'
})
export class CodePromoComponent {
  promoCode = 'BOOSTE PME';
  reduction = 15; // pourcentage de réduction
  prixInitial = 59; // prix initial avant promo
  promoEndTimestamp!: number;
  isPromoExpired: boolean = false;
  remainingTime: { days: number, hours: number, minutes: number, seconds: number } = { days: 0, hours: 0, minutes: 0, seconds: 0 };

  private timerSubscription!: Subscription;

  ngOnInit(): void {
    // Définir la fin de la promo dans par exemple 48h
    const now = new Date().getTime();
    const twoDaysLater = now + (48 * 60 * 60 * 1000); // 48 heures après
    this.promoEndTimestamp = twoDaysLater;

    // Mettre à jour le compteur toutes les secondes
    this.timerSubscription = interval(1000).subscribe(() => {
      this.updateCountdown();
    });
  }

  ngOnDestroy(): void {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
  }

  updateCountdown(): void {
    const now = new Date().getTime();
    const distance = this.promoEndTimestamp - now;

    if (distance <= 0) {
      // Promo terminée
      this.remainingTime = { days: 0, hours: 0, minutes: 0, seconds: 0 };
      if (this.timerSubscription) {
        this.timerSubscription.unsubscribe();
      }
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    this.remainingTime = { days, hours, minutes, seconds };
  }

  get prixApresPromo(): number {
    return Math.round(this.prixInitial * (1 - this.reduction / 100));
  }
}
