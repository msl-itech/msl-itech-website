import { Component, OnInit } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import confetti from 'canvas-confetti';

// Interfaces
interface Answer {
  text: string;
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
  currentStep: 'welcome' | 'questions' | 'result' | 'contact' = 'welcome';
  currentQuestionIndex: number = 0;
  selectedAnswers: number[] = [];

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

  // Questions du questionnaire
  questions: Question[] = [
    {
      id: 1,
      question: 'Quel est votre principal objectif ?',
      objective: 'Déterminer le type de besoin',
      weight: 3,
      answers: [
        {
          text: 'Être visible sur Google',
          icon: 'fas fa-search',
          technology: 'wordpress',
          points: 3
        },
        {
          text: 'Vendre en ligne / gérer mes devis',
          icon: 'fas fa-shopping-cart',
          technology: 'odoo',
          points: 3
        },
        {
          text: 'Créer une plateforme sur-mesure',
          icon: 'fas fa-code',
          technology: 'angular',
          points: 3
        }
      ]
    },
    {
      id: 2,
      question: 'Qui va gérer le contenu du site ?',
      objective: 'Mesurer autonomie & profil',
      weight: 2,
      answers: [
        {
          text: 'Moi-même sans compétence technique',
          icon: 'fas fa-user',
          technology: 'wordpress',
          points: 2
        },
        {
          text: 'Mon équipe commerciale',
          icon: 'fas fa-users',
          technology: 'odoo',
          points: 2
        },
        {
          text: 'Mon équipe technique',
          icon: 'fas fa-laptop-code',
          technology: 'angular',
          points: 2
        }
      ]
    },
    {
      id: 3,
      question: 'Qu\'attendez-vous de votre site ?',
      objective: 'Identifier les priorités',
      weight: 2,
      answers: [
        {
          text: 'Attirer des clients / SEO',
          icon: 'fas fa-chart-line',
          technology: 'wordpress',
          points: 2
        },
        {
          text: 'Gérer mes ventes et clients',
          icon: 'fas fa-handshake',
          technology: 'odoo',
          points: 2
        },
        {
          text: 'Offrir une expérience interactive unique',
          icon: 'fas fa-magic',
          technology: 'angular',
          points: 2
        }
      ]
    },
    {
      id: 4,
      question: 'Souhaitez-vous relier votre site à d\'autres outils (CRM, facturation, etc.) ?',
      objective: 'Vérifier besoin d\'intégration',
      weight: 3,
      answers: [
        {
          text: 'Non / Peu',
          icon: 'fas fa-times-circle',
          technology: 'wordpress',
          points: 3
        },
        {
          text: 'Oui, avec Odoo',
          icon: 'fas fa-link',
          technology: 'odoo',
          points: 3
        },
        {
          text: 'Oui, plusieurs systèmes complexes',
          icon: 'fas fa-network-wired',
          technology: 'angular',
          points: 3
        }
      ]
    },
    {
      id: 5,
      question: 'Quel budget prévoyez-vous pour votre projet web ?',
      objective: 'Filtrer selon la capacité d\'investissement',
      weight: 1,
      answers: [
        {
          text: 'Moins de 1 000 €',
          icon: 'fas fa-euro-sign',
          technology: 'wordpress',
          points: 1
        },
        {
          text: 'Entre 1 000 € et 3 000 €',
          icon: 'fas fa-coins',
          technology: 'odoo',
          points: 1
        },
        {
          text: 'Plus de 3 000 €',
          icon: 'fas fa-money-bill-wave',
          technology: 'angular',
          points: 1
        }
      ]
    },
    {
      id: 6,
      question: 'Quelle importance accordez-vous à la personnalisation graphique / expérience utilisateur ?',
      objective: 'Priorité UX / UI',
      weight: 2,
      answers: [
        {
          text: 'Modèle prêt à l\'emploi',
          icon: 'fas fa-layer-group',
          technology: 'wordpress',
          points: 2
        },
        {
          text: 'Personnalisation simple',
          icon: 'fas fa-paint-brush',
          technology: 'odoo',
          points: 2
        },
        {
          text: 'Expérience unique et interactive',
          icon: 'fas fa-palette',
          technology: 'angular',
          points: 2
        }
      ]
    }
  ];

  // Définitions des résultats
  results: { [key: string]: Result } = {
    wordpress: {
      technology: 'wordpress',
      name: 'WordPress',
      score: 0,
      title: 'Site WordPress',
      description: 'Parfait pour être visible rapidement sur Google avec un budget maîtrisé. WordPress est idéal pour les sites vitrines, blogs et PME qui veulent une solution simple et efficace.',
      icon: 'fab fa-wordpress',
      color: '#21759b',
      features: [
        'Mise en ligne rapide (2-6 semaines)',
        'Gestion autonome du contenu',
        'Optimisé pour le référencement SEO',
        'Budget accessible (900€ - 4 500€)',
        'Grande bibliothèque de thèmes et plugins'
      ],
      priceRange: 'à partir de 900€'
    },
    odoo: {
      technology: 'odoo',
      name: 'Odoo Website',
      score: 0,
      title: 'Site Odoo',
      description: 'La solution idéale si vous avez besoin d\'un site relié à votre gestion (CRM, devis, facturation, e-commerce). Odoo centralise tout votre business dans une seule plateforme.',
      icon: 'fas fa-cube',
      color: '#714B67',
      features: [
        'Intégration complète avec Odoo CRM/ERP',
        'Gestion des devis et factures en ligne',
        'E-commerce intégré',
        'Suivi clients automatisé',
        'Évolutif selon vos besoins'
      ],
      priceRange: 'à partir de 1 080€'
    },
    angular: {
      technology: 'angular',
      name: 'Application Angular',
      score: 0,
      title: 'Application sur-mesure (Angular/React)',
      description: 'Pour les projets ambitieux nécessitant une expérience utilisateur exceptionnelle, des fonctionnalités complexes ou une application métier. Solution 100% personnalisée.',
      icon: 'fab fa-angular',
      color: '#dd0031',
      features: [
        'Développement 100% sur-mesure',
        'Performance optimale',
        'Évolutivité illimitée',
        'Intégrations API complexes',
        'Expérience utilisateur unique'
      ],
      priceRange: 'à partir de 3 750€'
    }
  };

  ngOnInit() {
    // Initialisation
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
    this.currentStep = 'questions';
  }

  selectAnswer(answerIndex: number) {
    const currentQuestion = this.questions[this.currentQuestionIndex];
    const selectedAnswer = currentQuestion.answers[answerIndex];

    // Enregistrer la réponse
    this.selectedAnswers[this.currentQuestionIndex] = answerIndex;

    // Calculer les scores
    this.scores[selectedAnswer.technology] += selectedAnswer.points * currentQuestion.weight;

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
  }

  // Calcul des résultats
  calculateResults() {
    // Mettre à jour les scores dans les résultats
    // Score maximum possible : 31 points (9+4+4+9+1+4 = 3*3+2*2+2*2+3*3+1*1+2*2)
    // Affiché sur 20 pour une meilleure compréhension : (score / 31) * 20
    this.results['wordpress'].score = this.scores.wordpress;
    this.results['odoo'].score = this.scores.odoo;
    this.results['angular'].score = this.scores.angular;

    // Trier par score
    const sortedResults = Object.values(this.results).sort((a, b) => b.score - a.score);

    // Résultat recommandé
    this.recommendedResult = sortedResults[0];

    // Alternatives
    this.alternativeResults = sortedResults.slice(1, 3);

    // Lancer les effets visuels et sonores
    setTimeout(() => {
      this.launchConfetti();
      this.playSuccessSound();
    }, 500);
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
