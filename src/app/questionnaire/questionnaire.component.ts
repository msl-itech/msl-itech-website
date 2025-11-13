import { Component, OnInit } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import confetti from 'canvas-confetti';
import { OdooService } from '../services/odoo.service';

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
          description: 'Ex: Site vitrine, blog, présentation de services pour attirer des clients via le référencement naturel',
          icon: 'fas fa-search',
          technology: 'wordpress',
          points: 3
        },
        {
          text: 'Vendre en ligne / gérer mes devis',
          description: 'Ex: Boutique e-commerce, suivi des commandes, gestion des clients et de la facturation',
          icon: 'fas fa-shopping-cart',
          technology: 'odoo',
          points: 3
        },
        {
          text: 'Créer une plateforme sur-mesure',
          description: 'Ex: Application métier spécifique, plateforme collaborative, outil avec des fonctionnalités uniques',
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
          description: 'J\'ai besoin d\'une interface simple pour modifier textes et images sans toucher au code',
          icon: 'fas fa-user',
          technology: 'wordpress',
          points: 2
        },
        {
          text: 'Mon équipe commerciale',
          description: 'Mon équipe doit gérer les produits, devis et clients de façon autonome',
          icon: 'fas fa-users',
          technology: 'odoo',
          points: 2
        },
        {
          text: 'Mon équipe technique',
          description: 'Nous avons des développeurs pour maintenir et faire évoluer la plateforme',
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
          description: 'Priorité au référencement Google, contenus optimisés, blog et visibilité en ligne',
          icon: 'fas fa-chart-line',
          technology: 'wordpress',
          points: 2
        },
        {
          text: 'Gérer mes ventes et clients',
          description: 'Centraliser devis, factures, commandes et relation client dans un seul outil',
          icon: 'fas fa-handshake',
          technology: 'odoo',
          points: 2
        },
        {
          text: 'Offrir une expérience interactive unique',
          description: 'Interface moderne, animations fluides, expérience utilisateur sur-mesure et innovante',
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
          description: 'Le site est autonome, pas besoin de connexion avec d\'autres logiciels métier',
          icon: 'fas fa-times-circle',
          technology: 'wordpress',
          points: 3
        },
        {
          text: 'Oui, avec Odoo',
          description: 'J\'utilise déjà Odoo ou je veux que tout soit centralisé dans une seule plateforme',
          icon: 'fas fa-link',
          technology: 'odoo',
          points: 3
        },
        {
          text: 'Oui, plusieurs systèmes complexes',
          description: 'Ex: Connexion API avec ERP, systèmes de paiement, bases de données externes, services tiers',
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
          description: 'Budget limité, je cherche une solution économique et rapide à mettre en place',
          icon: 'fas fa-euro-sign',
          technology: 'wordpress',
          points: 1
        },
        {
          text: 'Entre 1 000 € et 3 000 €',
          description: 'Budget intermédiaire pour une solution complète avec gestion commerciale intégrée',
          icon: 'fas fa-coins',
          technology: 'odoo',
          points: 1
        },
        {
          text: 'Plus de 3 000 €',
          description: 'Budget conséquent pour un développement sur-mesure et des fonctionnalités avancées',
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
          description: 'Un thème professionnel suffit, l\'essentiel est d\'être en ligne rapidement',
          icon: 'fas fa-layer-group',
          technology: 'wordpress',
          points: 2
        },
        {
          text: 'Personnalisation simple',
          description: 'Adaptation aux couleurs de ma marque, mise en page standard mais personnalisée',
          icon: 'fas fa-paint-brush',
          technology: 'odoo',
          points: 2
        },
        {
          text: 'Expérience unique et interactive',
          description: 'Design 100% sur-mesure, animations, parcours utilisateur innovant et différenciant',
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

  constructor(private odooService: OdooService) {}

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

    // Mettre à jour le lead dans Odoo avec les résultats du questionnaire
    this.updateLeadWithResults();

    // Lancer les effets visuels et sonores
    setTimeout(() => {
      this.launchConfetti();
      this.playSuccessSound();
    }, 500);
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
