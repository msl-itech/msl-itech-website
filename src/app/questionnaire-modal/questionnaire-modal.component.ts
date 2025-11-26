import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-questionnaire-modal',
  templateUrl: './questionnaire-modal.component.html',
  styleUrls: ['./questionnaire-modal.component.css']
})
export class QuestionnaireModalComponent implements OnInit, OnDestroy {
  isVisible: boolean = false;
  isClosing: boolean = false;
  private modalTimeout: any;

  constructor(
    private router: Router,
    public translate: TranslateService
  ) {}

  ngOnInit(): void {
    // Vérifier si le modal a déjà été affiché
    const hasSeenModal = localStorage.getItem('questionnaire-modal-seen');
    const lastShown = localStorage.getItem('questionnaire-modal-last-shown');
    const now = Date.now();

    // Afficher le modal si:
    // 1. Jamais vu OU
    // 2. Vu il y a plus de 7 jours
    if (!hasSeenModal || (lastShown && now - parseInt(lastShown) > 7 * 24 * 60 * 60 * 1000)) {
      // Afficher après 5 secondes de navigation
      this.modalTimeout = setTimeout(() => {
        this.showModal();
        this.playNotificationSound();
      }, 5000);
    }
  }

  ngOnDestroy(): void {
    if (this.modalTimeout) {
      clearTimeout(this.modalTimeout);
    }
  }

  showModal(): void {
    this.isVisible = true;
    // Mémoriser que le modal a été affiché
    localStorage.setItem('questionnaire-modal-seen', 'true');
    localStorage.setItem('questionnaire-modal-last-shown', Date.now().toString());
  }

  closeModal(): void {
    this.isClosing = true;
    setTimeout(() => {
      this.isVisible = false;
      this.isClosing = false;
    }, 300);
  }

  navigateToQuestionnaire(): void {
    this.closeModal();
    setTimeout(() => {
      this.router.navigate(['/questionnaire']);
    }, 300);
  }

  // Jouer un son de notification subtil
  playNotificationSound(): void {
    try {
      // Créer un son de notification doux avec Web Audio API
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();

      // Son de notification (deux notes douces)
      const playTone = (frequency: number, startTime: number, duration: number) => {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.value = frequency;
        oscillator.type = 'sine';

        gainNode.gain.setValueAtTime(0, startTime);
        gainNode.gain.linearRampToValueAtTime(0.1, startTime + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + duration);

        oscillator.start(startTime);
        oscillator.stop(startTime + duration);
      };

      const currentTime = audioContext.currentTime;
      playTone(800, currentTime, 0.15);
      playTone(1000, currentTime + 0.1, 0.15);
    } catch (error) {
      console.log('Audio notification non disponible');
    }
  }
}
