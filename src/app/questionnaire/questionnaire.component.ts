import { Component, OnInit } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import confetti from 'canvas-confetti';
import { OdooService } from '../services/odoo.service';
import { TranslateService } from '@ngx-translate/core';

// Interfaces
interface Answer {
  text: string;
  description: string; // Phrase de contexte/exemple
  icon: string;
  technology: 'wordpress' | 'odoo' | 'angular';
  points: number;
}

interface Question {
  id: number;
  question: string;
  objective: string;
  weight: number;
  answers: Answer[];
}

interface Result {
  technology: string;
  name: string;
  score: number;
  title: string;
  description: string;
  icon: string;
  color: string;
  features: string[];
  priceRange: string;
  packageLevel?: 'basic' | 'professional' | 'business'; // Niveau de package recommandé
  packageName?: string; // Nom du package (traduit)
}

interface UserData {
  name?: string;
  email?: string;
  phone?: string;
}

@Component({
  selector: 'app-questionnaire',
  templateUrl: './questionnaire.component.html',
  styleUrls: ['./questionnaire.component.css'],
  animations: [
    trigger('slideAnimation', [
      transition(':enter', [
        style({ transform: 'translateX(100%)', opacity: 0 }),
        animate('500ms ease-out', style({ transform: 'translateX(0)', opacity: 1 }))
      ]),
      transition(':leave', [
        animate('500ms ease-in', style({ transform: 'translateX(-100%)', opacity: 0 }))
      ])
    ]),
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.9)' }),
        animate('400ms ease-out', style({ opacity: 1, transform: 'scale(1)' }))
      ])
    ])
  ]
})
export class QuestionnaireComponent implements OnInit {
  // État de l'application
  currentStep: 'welcome' | 'contact-form' | 'questions' | 'result' | 'contact' = 'welcome';
  currentQuestionIndex: number = 0;
  selectedAnswers: number[] = [];
  leadId: number | null = null; // ID du lead créé dans Odoo
  isSubmittingContact: boolean = false; // État du spinner pour le formulaire de contact

  // Scores
  scores = {
    wordpress: 0,
    odoo: 0,
    angular: 0
  };

  // Données utilisateur
  userData: UserData = {};

  // Résultat
  recommendedResult: Result | null = null;
  alternativeResults: Result[] = [];

  // Niveau de package basé sur le budget (Question 5)
  budgetLevel: 'basic' | 'professional' | 'business' = 'basic';

  // Questions du questionnaire (chargées dynamiquement depuis les traductions)
  questions: Question[] = [];

  // Définitions des résultats (chargées dynamiquement depuis les traductions)
  results: { [key: string]: Result } = {};

  constructor(
    private odooService: OdooService,
    public translate: TranslateService
  ) {}

  ngOnInit() {
    // Charger les traductions des questions dynamiquement
    this.loadTranslatedQuestions();
    this.loadTranslatedResults();
  }

  // Charger les questions traduites
  loadTranslatedQuestions() {
    this.translate.get('QUESTIONNAIRE.QUESTIONS').subscribe((translations: any) => {
      this.questions = [
        {
          id: 1,
          question: translations.Q1.QUESTION,
          objective: translations.Q1.OBJECTIVE,
          weight: 3,
          answers: [
            {
              text: translations.Q1.ANSWERS.A1.TEXT,
              description: translations.Q1.ANSWERS.A1.DESC,
              icon: 'fas fa-search',
              technology: 'wordpress',
              points: 3
            },
            {
              text: translations.Q1.ANSWERS.A2.TEXT,
              description: translations.Q1.ANSWERS.A2.DESC,
              icon: 'fas fa-shopping-cart',
              technology: 'odoo',
              points: 3
            },
            {
              text: translations.Q1.ANSWERS.A3.TEXT,
              description: translations.Q1.ANSWERS.A3.DESC,
              icon: 'fas fa-code',
              technology: 'angular',
              points: 3
            }
          ]
        },
        {
          id: 2,
          question: translations.Q2.QUESTION,
          objective: translations.Q2.OBJECTIVE,
          weight: 2,
          answers: [
            {
              text: translations.Q2.ANSWERS.A1.TEXT,
              description: translations.Q2.ANSWERS.A1.DESC,
              icon: 'fas fa-user',
              technology: 'wordpress',
              points: 2
            },
            {
              text: translations.Q2.ANSWERS.A2.TEXT,
              description: translations.Q2.ANSWERS.A2.DESC,
              icon: 'fas fa-users',
              technology: 'odoo',
              points: 2
            },
            {
              text: translations.Q2.ANSWERS.A3.TEXT,
              description: translations.Q2.ANSWERS.A3.DESC,
              icon: 'fas fa-laptop-code',
              technology: 'angular',
              points: 2
            }
          ]
        },
        {
          id: 3,
          question: translations.Q3.QUESTION,
          objective: translations.Q3.OBJECTIVE,
          weight: 2,
          answers: [
            {
              text: translations.Q3.ANSWERS.A1.TEXT,
              description: translations.Q3.ANSWERS.A1.DESC,
              icon: 'fas fa-rocket',
              technology: 'wordpress',
              points: 2
            },
            {
              text: translations.Q3.ANSWERS.A2.TEXT,
              description: translations.Q3.ANSWERS.A2.DESC,
              icon: 'fas fa-cogs',
              technology: 'odoo',
              points: 2
            },
            {
              text: translations.Q3.ANSWERS.A3.TEXT,
              description: translations.Q3.ANSWERS.A3.DESC,
              icon: 'fas fa-trophy',
              technology: 'angular',
              points: 2
            }
          ]
        },
        {
          id: 4,
          question: translations.Q4.QUESTION,
          objective: translations.Q4.OBJECTIVE,
          weight: 3,
          answers: [
            {
              text: translations.Q4.ANSWERS.A1.TEXT,
              description: translations.Q4.ANSWERS.A1.DESC,
              icon: 'fas fa-times-circle',
              technology: 'wordpress',
              points: 3
            },
            {
              text: translations.Q4.ANSWERS.A2.TEXT,
              description: translations.Q4.ANSWERS.A2.DESC,
              icon: 'fas fa-link',
              technology: 'odoo',
              points: 3
            },
            {
              text: translations.Q4.ANSWERS.A3.TEXT,
              description: translations.Q4.ANSWERS.A3.DESC,
              icon: 'fas fa-network-wired',
              technology: 'angular',
              points: 3
            }
          ]
        },
        {
          id: 5,
          question: translations.Q5.QUESTION,
          objective: translations.Q5.OBJECTIVE,
          weight: 3,
          answers: [
            {
              text: translations.Q5.ANSWERS.A1.TEXT,
              description: translations.Q5.ANSWERS.A1.DESC,
              icon: 'fas fa-piggy-bank',
              technology: 'wordpress',
              points: 3
            },
            {
              text: translations.Q5.ANSWERS.A2.TEXT,
              description: translations.Q5.ANSWERS.A2.DESC,
              icon: 'fas fa-balance-scale',
              technology: 'odoo',
              points: 3
            },
            {
              text: translations.Q5.ANSWERS.A3.TEXT,
              description: translations.Q5.ANSWERS.A3.DESC,
              icon: 'fas fa-gem',
              technology: 'angular',
              points: 3
            }
          ]
        },
        {
          id: 6,
          question: translations.Q6.QUESTION,
          objective: translations.Q6.OBJECTIVE,
          weight: 2,
          answers: [
            {
              text: translations.Q6.ANSWERS.A1.TEXT,
              description: translations.Q6.ANSWERS.A1.DESC,
              icon: 'fas fa-layer-group',
              technology: 'wordpress',
              points: 2
            },
            {
              text: translations.Q6.ANSWERS.A2.TEXT,
              description: translations.Q6.ANSWERS.A2.DESC,
              icon: 'fas fa-paint-brush',
              technology: 'odoo',
              points: 2
            },
            {
              text: translations.Q6.ANSWERS.A3.TEXT,
              description: translations.Q6.ANSWERS.A3.DESC,
              icon: 'fas fa-palette',
              technology: 'angular',
              points: 2
            }
          ]
        }
      ];
    });
  }

  // Charger les résultats traduits
  loadTranslatedResults() {
    this.translate.get('QUESTIONNAIRE.RESULTS').subscribe((translations: any) => {
      this.results = {
        wordpress: {
          technology: 'wordpress',
          name: translations.WORDPRESS.NAME,
          score: 0,
          title: translations.WORDPRESS.TITLE,
          description: translations.WORDPRESS.DESCRIPTION,
          icon: 'fab fa-wordpress',
          color: '#21759b',
          features: [
            translations.WORDPRESS.FEATURES.F1,
            translations.WORDPRESS.FEATURES.F2,
            translations.WORDPRESS.FEATURES.F3,
            translations.WORDPRESS.FEATURES.F4,
            translations.WORDPRESS.FEATURES.F5
          ],
          priceRange: '', // Sera mis à jour dans calculateResults()
          packageLevel: 'basic',
          packageName: ''
        },
        odoo: {
          technology: 'odoo',
          name: translations.ODOO.NAME,
          score: 0,
          title: translations.ODOO.TITLE,
          description: translations.ODOO.DESCRIPTION,
          icon: 'fas fa-cube',
          color: '#714B67',
          features: [
            translations.ODOO.FEATURES.F1,
            translations.ODOO.FEATURES.F2,
            translations.ODOO.FEATURES.F3,
            translations.ODOO.FEATURES.F4,
            translations.ODOO.FEATURES.F5
          ],
          priceRange: '', // Sera mis à jour dans calculateResults()
          packageLevel: 'basic',
          packageName: ''
        },
        angular: {
          technology: 'angular',
          name: translations.ANGULAR.NAME,
          score: 0,
          title: translations.ANGULAR.TITLE,
          description: translations.ANGULAR.DESCRIPTION,
          icon: 'fab fa-angular',
          color: '#dd0031',
          features: [
            translations.ANGULAR.FEATURES.F1,
            translations.ANGULAR.FEATURES.F2,
            translations.ANGULAR.FEATURES.F3,
            translations.ANGULAR.FEATURES.F4,
            translations.ANGULAR.FEATURES.F5
          ],
          priceRange: '', // Sera mis à jour dans calculateResults()
          packageLevel: 'basic',
          packageName: ''
        }
      };
    });
  }

  // Effets visuels et sonores
  launchConfetti() {
    // Configuration des confettis
    const duration = 3000; // 3 secondes
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    function randomInRange(min: number, max: number) {
      return Math.random() * (max - min) + min;
    }

    // Lancer plusieurs vagues de confettis
    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);

      // Confettis depuis la gauche
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        colors: ['#114d5a', '#ffdd57', '#1a6675', '#ffd700', '#28a745']
      });

      // Confettis depuis la droite
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        colors: ['#114d5a', '#ffdd57', '#1a6675', '#ffd700', '#28a745']
      });
    }, 250);

    // Confettis explosifs au centre
    setTimeout(() => {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#114d5a', '#ffdd57', '#1a6675', '#ffd700']
      });
    }, 200);
  }

  playSuccessSound() {
    // Créer un son de succès avec Web Audio API
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();

    // Première note (tonalité positive)
    const oscillator1 = audioContext.createOscillator();
    const gainNode1 = audioContext.createGain();

    oscillator1.connect(gainNode1);
    gainNode1.connect(audioContext.destination);

    oscillator1.frequency.value = 523.25; // Do (C5)
    oscillator1.type = 'sine';

    gainNode1.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode1.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);

    oscillator1.start(audioContext.currentTime);
    oscillator1.stop(audioContext.currentTime + 0.3);

    // Deuxième note (harmonie)
    setTimeout(() => {
      const oscillator2 = audioContext.createOscillator();
      const gainNode2 = audioContext.createGain();

      oscillator2.connect(gainNode2);
      gainNode2.connect(audioContext.destination);

      oscillator2.frequency.value = 659.25; // Mi (E5)
      oscillator2.type = 'sine';

      gainNode2.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode2.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.4);

      oscillator2.start(audioContext.currentTime);
      oscillator2.stop(audioContext.currentTime + 0.4);
    }, 100);

    // Troisième note (finale)
    setTimeout(() => {
      const oscillator3 = audioContext.createOscillator();
      const gainNode3 = audioContext.createGain();

      oscillator3.connect(gainNode3);
      gainNode3.connect(audioContext.destination);

      oscillator3.frequency.value = 783.99; // Sol (G5)
      oscillator3.type = 'sine';

      gainNode3.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode3.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

      oscillator3.start(audioContext.currentTime);
      oscillator3.stop(audioContext.currentTime + 0.5);
    }, 200);
  }

  // Navigation
  startQuestionnaire() {
    this.currentStep = 'contact-form';
  }

  // Soumettre le formulaire de contact et créer le lead dans Odoo
  submitContactForm() {
    // Validation des champs
    if (!this.userData.name || !this.userData.email || !this.userData.phone) {
      alert('Veuillez remplir tous les champs');
      return;
    }

    // Validation basique de l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.userData.email)) {
      alert('Veuillez entrer une adresse email valide');
      return;
    }

    // Activer le spinner
    this.isSubmittingContact = true;

    // Créer le lead dans Odoo CRM
    const leadData = {
      name: `Questionnaire - ${this.userData.name}`,
      partner_name: this.userData.name,
      email_from: this.userData.email,
      phone: this.userData.phone,
      stage_id: 1, // Stage initial (à ajuster selon votre configuration Odoo)
      description: 'Lead créé depuis le questionnaire web'
    };

    this.odooService.createLead(leadData).subscribe({
      next: (response: any) => {
        console.log('Lead créé avec succès:', response);
        // La réponse contient { success: true, message: "Lead créé avec succès", lead_id: 12919 }
        this.leadId = response.lead_id ?? null;
        this.isSubmittingContact = false;
        this.currentStep = 'questions';
      },
      error: (error: any) => {
        console.error('Erreur lors de la création du lead:', error);
        this.isSubmittingContact = false;
        // On continue quand même vers les questions même en cas d'erreur
        // pour ne pas bloquer l'utilisateur
        alert('Une erreur est survenue, mais vous pouvez continuer le questionnaire.');
        this.currentStep = 'questions';
      }
    });
  }

  selectAnswer(answerIndex: number) {
    const currentQuestion = this.questions[this.currentQuestionIndex];
    const selectedAnswer = currentQuestion.answers[answerIndex];

    // Enregistrer la réponse
    this.selectedAnswers[this.currentQuestionIndex] = answerIndex;

    // Calculer les scores
    this.scores[selectedAnswer.technology] += selectedAnswer.points * currentQuestion.weight;

    // Si c'est la question 5 (budget), déterminer le niveau de package
    // Question 5 a l'id = 5, index = 4
    if (currentQuestion.id === 5) {
      if (answerIndex === 0) {
        this.budgetLevel = 'basic'; // Moins de 1 500€
      } else if (answerIndex === 1) {
        this.budgetLevel = 'professional'; // 4 000€ - 5 000€
      } else if (answerIndex === 2) {
        this.budgetLevel = 'business'; // Plus de 4 000€
      }
    }

    // Passer à la question suivante ou aux résultats
    setTimeout(() => {
      if (this.currentQuestionIndex < this.questions.length - 1) {
        this.currentQuestionIndex++;
      } else {
        this.calculateResults();
        this.currentStep = 'result';
      }
    }, 300);
  }

  previousQuestion() {
    if (this.currentQuestionIndex > 0) {
      // Retirer les points de la réponse précédente
      const previousQuestion = this.questions[this.currentQuestionIndex];
      const previousAnswerIndex = this.selectedAnswers[this.currentQuestionIndex];

      if (previousAnswerIndex !== undefined) {
        const previousAnswer = previousQuestion.answers[previousAnswerIndex];
        this.scores[previousAnswer.technology] -= previousAnswer.points * previousQuestion.weight;
      }

      this.currentQuestionIndex--;
    }
  }

  restartQuestionnaire() {
    this.currentStep = 'welcome';
    this.currentQuestionIndex = 0;
    this.selectedAnswers = [];
    this.scores = { wordpress: 0, odoo: 0, angular: 0 };
    this.recommendedResult = null;
    this.alternativeResults = [];
    this.userData = {};
    this.leadId = null;
    this.budgetLevel = 'basic'; // Réinitialiser le niveau de budget
  }

  // Calcul des résultats
  calculateResults() {
    // Mettre à jour les scores dans les résultats
    // Score maximum possible : 31 points (9+4+4+9+1+4 = 3*3+2*2+2*2+3*3+1*1+2*2)
    // Affiché sur 20 pour une meilleure compréhension : (score / 31) * 20
    this.results['wordpress'].score = this.scores.wordpress;
    this.results['odoo'].score = this.scores.odoo;
    this.results['angular'].score = this.scores.angular;

    // Assigner le niveau de package et le prix basé sur le budget de l'utilisateur
    this.assignPackageToResults();

    // Trier par score
    const sortedResults = Object.values(this.results).sort((a, b) => b.score - a.score);

    // Résultat recommandé
    this.recommendedResult = sortedResults[0];

    // Alternatives
    this.alternativeResults = sortedResults.slice(1, 3);

    // Mettre à jour le lead dans Odoo avec les résultats du questionnaire
    this.updateLeadWithResults();

    // Lancer les effets visuels et sonores
    setTimeout(() => {
      this.launchConfetti();
      this.playSuccessSound();
    }, 500);
  }

  // Assigner le package et le prix basé sur le niveau de budget
  assignPackageToResults() {
    // Obtenir les traductions pour les packages
    this.translate.get('QUESTIONNAIRE.RESULTS').subscribe((translations: any) => {
      const packageKey = this.budgetLevel.toUpperCase(); // BASIC, PROFESSIONAL, BUSINESS
      const packageName = translations.PACKAGES[packageKey];

      // Mettre à jour WordPress
      this.results['wordpress'].packageLevel = this.budgetLevel;
      this.results['wordpress'].packageName = packageName;
      this.results['wordpress'].priceRange = this.translate.instant('QUESTIONNAIRE.RESULTS.PRICE_FROM', {
        price: translations.WORDPRESS.PRICE_RANGES[packageKey]
      });

      // Mettre à jour Odoo
      this.results['odoo'].packageLevel = this.budgetLevel;
      this.results['odoo'].packageName = packageName;
      this.results['odoo'].priceRange = this.translate.instant('QUESTIONNAIRE.RESULTS.PRICE_FROM', {
        price: translations.ODOO.PRICE_RANGES[packageKey]
      });

      // Mettre à jour Angular
      this.results['angular'].packageLevel = this.budgetLevel;
      this.results['angular'].packageName = packageName;
      this.results['angular'].priceRange = this.translate.instant('QUESTIONNAIRE.RESULTS.PRICE_FROM', {
        price: translations.ANGULAR.PRICE_RANGES[packageKey]
      });
    });
  }

  // Mettre à jour le lead avec les résultats du questionnaire
  updateLeadWithResults() {
    if (!this.leadId) {
      console.warn('Pas de leadId, impossible de mettre à jour le lead');
      return;
    }

    // Construire la description détaillée avec les résultats en HTML
    const scoreWordpress = (this.scores.wordpress / 31 * 20).toFixed(1);
    const scoreOdoo = (this.scores.odoo / 31 * 20).toFixed(1);
    const scoreAngular = (this.scores.angular / 31 * 20).toFixed(1);

    const descriptionParts = [
      `<h2>📊 Résultats du Questionnaire Web</h2>`,
      `<hr/>`,

      `<h3>🏆 Solution Recommandée</h3>`,
      `<p><strong>${this.recommendedResult?.name}</strong></p>`,
      `<p>Score de compatibilité : <strong style="color: #28a745; font-size: 1.2em;">${(this.recommendedResult!.score / 31 * 20).toFixed(1)}/20</strong></p>`,

      `<h3>📈 Scores Détaillés</h3>`,
      `<ul>`,
      `<li><strong>WordPress :</strong> ${scoreWordpress}/20 <em>(${this.scores.wordpress} points bruts)</em></li>`,
      `<li><strong>Odoo :</strong> ${scoreOdoo}/20 <em>(${this.scores.odoo} points bruts)</em></li>`,
      `<li><strong>Angular :</strong> ${scoreAngular}/20 <em>(${this.scores.angular} points bruts)</em></li>`,
      `</ul>`,

      `<h3>💡 Réponses du Prospect</h3>`,
      this.getAnswersDetailsHTML(),

      `<hr/>`,
      `<h3>👤 Informations de Contact</h3>`,
      `<p><strong>Nom :</strong> ${this.userData.name}</p>`,
      `<p><strong>Email :</strong> <a href="mailto:${this.userData.email}">${this.userData.email}</a></p>`,
      `<p><strong>Téléphone :</strong> <a href="tel:${this.userData.phone}">${this.userData.phone}</a></p>`,
    ];

    const description = descriptionParts.filter(part => part).join('\n');

    const leadData = {
      description: description
    };

    this.odooService.updateLead(this.leadId, leadData).subscribe({
      next: (response: any) => {
        console.log('Lead mis à jour avec les résultats du questionnaire:', response);
      },
      error: (error: any) => {
        console.error('Erreur lors de la mise à jour du lead:', error);
      }
    });
  }

  // Obtenir le détail des réponses en HTML
  getAnswersDetailsHTML(): string {
    let html = '<ol>';
    this.questions.forEach((question, index) => {
      const answerIndex = this.selectedAnswers[index];
      if (answerIndex !== undefined) {
        const answer = question.answers[answerIndex];
        html += `<li>`;
        html += `<p><strong>${question.question}</strong></p>`;
        html += `<p style="margin-left: 20px;">✓ ${answer.text}</p>`;
        html += `</li>`;
      }
    });
    html += '</ol>';
    return html;
  }

  // Utilitaires
  getProgress(): number {
    return ((this.currentQuestionIndex + 1) / this.questions.length) * 100;
  }

  getCurrentQuestion(): Question {
    return this.questions[this.currentQuestionIndex];
  }

  isAnswerSelected(index: number): boolean {
    return this.selectedAnswers[this.currentQuestionIndex] === index;
  }

  // CTA Actions
  requestQuote() {
    // Ici, vous pourrez intégrer l'appel API vers Odoo CRM
    console.log('Demande de devis:', {
      userData: this.userData,
      recommendedTechnology: this.recommendedResult?.technology,
      scores: this.scores,
      answers: this.selectedAnswers
    });

    // Rediriger vers la page contact avec les paramètres
    window.location.href = `/contact?tech=${this.recommendedResult?.technology}&score=${this.recommendedResult?.score}`;
  }
}
