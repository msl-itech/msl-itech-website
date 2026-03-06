import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
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
    public translate: TranslateService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    // Vérifier si le modal a déjà été affiché
    const hasSeenModal = localStorage.getItem('questionnaire-modal-seen');
    const lastShown = localStorage.getItem('questionnaire-modal-last-shown');
    const now = Date.now();

    if (!hasSeenModal || (lastShown && now - parseInt(lastShown) > 7 * 24 * 60 * 60 * 1000)) {
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
    // Mémoriser que le modal a été affiché (browser uniquement)
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('questionnaire-modal-seen', 'true');
      localStorage.setItem('questionnaire-modal-last-shown', Date.now().toString());
    }
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

  playNotificationSound(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
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
