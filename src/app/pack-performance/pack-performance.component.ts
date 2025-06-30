import { AfterViewInit, Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-pack-performance',
  templateUrl: './pack-performance.component.html',
  styleUrl: './pack-performance.component.css',
})
export class PackPerformanceComponent implements OnInit, AfterViewInit {
  constructor(private translate: TranslateService) {}

  ngOnInit() {
    // Initialisation du composant
  }

  ngAfterViewInit() {
    // Initialiser le Pack Finder après que la vue soit chargée
    this.initPackFinder();

    // Afficher la mini popup après 5 secondes
    this.showMiniPopup();
  }

  private initPackFinder() {
    // Pack Finder Logic
    let currentQuestion = 1;
    const answers: any = {};

    const nextBtn = document.getElementById(
      'packFinderBtn'
    ) as HTMLButtonElement;
    const questions = document.querySelectorAll('.question-block');
    const navigation = document.getElementById('navigation');
    const result = document.getElementById('result');

    if (!nextBtn || !navigation || !result) {
      console.log('Éléments du Pack Finder non trouvés');
      return;
    }

    // Style pour les cartes sélectionnées
    this.addOptionStyles();

    // Gestion des sélections
    document.addEventListener('click', (e) => {
      // Vérifier si on clique sur une carte d'option
      const optionCard = (e.target as HTMLElement).closest('.option-card');
      if (optionCard) {
        const radio = optionCard.querySelector(
          'input[type="radio"]'
        ) as HTMLInputElement;
        if (radio) {
          // Cocher le radio
          radio.checked = true;

          // Supprimer la classe selected de toutes les cartes du même groupe
          const groupName = radio.name;
          document
            .querySelectorAll(`input[name="${groupName}"]`)
            .forEach((input) => {
              (input as HTMLElement)
                .closest('.option-card')
                ?.classList.remove('selected');
            });

          // Ajouter la classe selected à la carte sélectionnée
          optionCard.classList.add('selected');

          // Enregistrer la réponse
          answers[groupName] = radio.value;

          // Activer le bouton suivant
          nextBtn.disabled = false;
          nextBtn.style.opacity = '1';
        }
      }
    });

    // Gestion des changements de radio (au cas où)
    document.addEventListener('change', (e) => {
      const target = e.target as HTMLInputElement;
      if (target.type === 'radio') {
        // Supprimer la classe selected de toutes les cartes du même groupe
        const groupName = target.name;
        document
          .querySelectorAll(`input[name="${groupName}"]`)
          .forEach((input) => {
            (input as HTMLElement)
              .closest('.option-card')
              ?.classList.remove('selected');
          });

        // Ajouter la classe selected à la carte sélectionnée
        target.closest('.option-card')?.classList.add('selected');

        // Enregistrer la réponse
        answers[groupName] = target.value;

        // Activer le bouton suivant
        nextBtn.disabled = false;
        nextBtn.style.opacity = '1';
      }
    });

    // Navigation
    nextBtn.addEventListener('click', () => {
      if (currentQuestion < 3) {
        // Cacher la question actuelle
        const currentQuestionEl = document.getElementById(
          `question${currentQuestion}`
        );
        if (currentQuestionEl) {
          currentQuestionEl.style.display = 'none';
        }

        // Afficher la question suivante
        currentQuestion++;
        const nextQuestionEl = document.getElementById(
          `question${currentQuestion}`
        );
        if (nextQuestionEl) {
          nextQuestionEl.style.display = 'block';
        }

        // Réinitialiser le bouton
        nextBtn.disabled = true;
        nextBtn.style.opacity = '0.5';

        // Changer le texte du bouton pour la dernière question
        if (currentQuestion === 3) {
          const buttonText =
            this.translate.instant(
              'PAGES.PACK_PERFORMANCE.PACK_FINDER.BUTTONS.SHOW_PACK'
            ) || 'Voir mon pack idéal';
          nextBtn.innerHTML = '<i class="fas fa-magic me-2"></i>' + buttonText;
        }
      } else {
        // Afficher le résultat
        this.showResult(answers, navigation, result);
      }
    });
  }

  private addOptionStyles() {
    const style = document.createElement('style');
    style.innerHTML = `
      .option-card:hover {
        border-color: #ffdd57 !important;
        background: #fffef7 !important;
        transform: translateY(-3px);
        box-shadow: 0 5px 15px rgba(0,0,0,0.1);
      }
      .option-card.selected {
        border-color: #ffdd57 !important;
        background: #fffef7 !important;
        box-shadow: 0 0 0 3px rgba(255, 221, 87, 0.3);
      }
    `;
    document.head.appendChild(style);
  }

  private showResult(
    answers: any,
    navigation: HTMLElement,
    result: HTMLElement
  ) {
    // Cacher la navigation et la dernière question
    navigation.style.display = 'none';
    const question3 = document.getElementById('question3');
    if (question3) {
      question3.style.display = 'none';
    }

    // Déterminer le pack recommandé
    const pack = this.getRecommendedPack(answers);

    // Afficher le résultat avec gestion asynchrone des traductions
    const recommendedPackEl = document.getElementById('recommendedPack');
    const packDescriptionEl = document.getElementById('packDescription');

    // Utiliser les traductions avec fallback robuste
    if (recommendedPackEl) {
      this.translate.get(pack.nameKey).subscribe((translation: string) => {
        // Vérifier si la traduction est trouvée (différente de la clé)
        if (translation && translation !== pack.nameKey) {
          recommendedPackEl.textContent = translation;
        } else {
          recommendedPackEl.textContent = pack.name; // Utiliser le fallback
        }
      });
    }

    if (packDescriptionEl) {
      this.translate
        .get(pack.descriptionKey)
        .subscribe((translation: string) => {
          // Vérifier si la traduction est trouvée (différente de la clé)
          if (translation && translation !== pack.descriptionKey) {
            packDescriptionEl.textContent = translation;
          } else {
            packDescriptionEl.textContent = pack.description; // Utiliser le fallback
          }
        });
    }

    result.style.display = 'block';

    // Animation d'apparition
    result.style.opacity = '0';
    result.style.transform = 'scale(0.8)';
    setTimeout(() => {
      result.style.transition = 'all 0.5s ease';
      result.style.opacity = '1';
      result.style.transform = 'scale(1)';
    }, 100);
  }

  private getRecommendedPack(answers: any) {
    const { accompagnement, budget, besoin } = answers;

    // Logique de recommandation : Pack Premium ou Pack Avancé

    // Conditions pour le Pack Premium (budget élevé, besoins avancés)
    if (
      budget === 'plus-3000' ||
      accompagnement === 'personnalise' ||
      besoin === 'support-prioritaire' ||
      (budget === '1500-3000' && accompagnement === 'optimisation')
    ) {
      return {
        nameKey: 'PAGES.PACK_PERFORMANCE.PACKS.PREMIUM.NAME',
        descriptionKey: 'PAGES.PACK_PERFORMANCE.PACKS.PREMIUM.DESCRIPTION',
        name: this.getTranslationOrFallback(
          'PAGES.PACK_PERFORMANCE.PACKS.PREMIUM.NAME',
          'Pack Premium 👑'
        ),
        description: this.getTranslationOrFallback(
          'PAGES.PACK_PERFORMANCE.PACKS.PREMIUM.DESCRIPTION',
          'Solution haut de gamme avec accompagnement personnalisé, support prioritaire et optimisation complète de vos processus Odoo.'
        ),
      };
    }

    // Toutes les autres combinaisons mènent au Pack Avancé
    return {
      nameKey: 'PAGES.PACK_PERFORMANCE.PACKS.ADVANCED.NAME',
      descriptionKey: 'PAGES.PACK_PERFORMANCE.PACKS.ADVANCED.DESCRIPTION',
      name: this.getTranslationOrFallback(
        'PAGES.PACK_PERFORMANCE.PACKS.ADVANCED.NAME',
        'Pack Avancé ⚡'
      ),
      description: this.getTranslationOrFallback(
        'PAGES.PACK_PERFORMANCE.PACKS.ADVANCED.DESCRIPTION',
        'Solution complète pour développer votre activité avec Odoo. Configuration personnalisée, formation avancée et support technique inclus.'
      ),
    };
  }

  private showMiniPopup() {
    // Afficher la popup après 5 secondes
    setTimeout(() => {
      this.createMiniPopup();
    }, 5000);
  }

  private createMiniPopup() {
    // Vérifier si la popup n'existe pas déjà
    if (document.getElementById('miniPopup')) {
      return;
    }

    // Créer la popup
    const popup = document.createElement('div');
    popup.id = 'miniPopup';
    popup.innerHTML = `
      <div style="
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: linear-gradient(135deg, #114d5a 0%, #1a6275 100%);
        color: white;
        padding: 20px;
        border-radius: 16px;
        box-shadow: 0 12px 35px rgba(0,0,0,0.2);
        z-index: 1000;
        max-width: 350px;
        font-family: 'Segoe UI', sans-serif;
        animation: slideInUp 0.6s ease-out;
        border: 3px solid #ffdd57;
      ">
        <!-- Bouton fermer -->
        <div style="
          position: absolute;
          top: 8px;
          right: 8px;
          background: rgba(255,255,255,0.2);
          color: white;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          cursor: pointer;
          transition: background 0.3s ease;
        " 
        onmouseover="this.style.background='rgba(255,255,255,0.3)'"
        onmouseout="this.style.background='rgba(255,255,255,0.2)'"
        onclick="document.getElementById('miniPopup').remove()">
          ×
        </div>

        <!-- Contenu principal -->
        <div style="display: flex; align-items: flex-start; gap: 15px; margin-bottom: 15px;">
          <div style="
            background: #ffdd57;
            color: #114d5a;
            width: 45px;
            height: 45px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 22px;
            flex-shrink: 0;
          ">
            🎯
          </div>
          <div style="flex: 1;">
            <div style="font-weight: 700; font-size: 16px; margin-bottom: 5px;">
              Quel pack Odoo vous convient ?
            </div>
            <div style="font-size: 13px; opacity: 0.9; line-height: 1.4;">
              Découvrez en 3 questions rapides le pack idéal pour votre entreprise
            </div>
          </div>
        </div>

        <!-- Bouton Call to Action -->
        <button style="
          width: 100%;
          background: #ffdd57;
          color: #114d5a;
          border: none;
          padding: 12px 20px;
          border-radius: 10px;
          font-weight: 600;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        "
        onmouseover="this.style.background='#ffe584'; this.style.transform='translateY(-1px)'"
        onmouseout="this.style.background='#ffdd57'; this.style.transform='translateY(0)'"
        onclick="window.scrollToPackFinder(); document.getElementById('miniPopup').remove();">
          <span>🚀</span>
          Faire le test gratuit
        </button>
      </div>
    `;

    // Ajouter les styles d'animation
    const style = document.createElement('style');
    style.innerHTML = `
      @keyframes slideInUp {
        from {
          transform: translateY(120px);
          opacity: 0;
        }
        to {
          transform: translateY(0);
          opacity: 1;
        }
      }
      
      #miniPopup {
        transition: box-shadow 0.3s ease;
      }
      
      #miniPopup:hover {
        box-shadow: 0 15px 40px rgba(0,0,0,0.25);
      }
    `;
    document.head.appendChild(style);

    // Ajouter la popup au DOM
    document.body.appendChild(popup);

    // Créer une fonction globale pour le scroll
    (window as any).scrollToPackFinder = () => {
      this.scrollToPackFinder();
    };

    // La popup reste affichée jusqu'à fermeture manuelle
  }

  private scrollToPackFinder() {
    const packFinderElement = document.getElementById('pack-finder');
    if (packFinderElement) {
      packFinderElement.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }

  private getTranslationOrFallback(key: string, fallback: string): string {
    const translation = this.translate.instant(key);
    // Si la traduction est différente de la clé, elle a été trouvée
    if (translation && translation !== key) {
      return translation;
    }
    // Sinon, utiliser la valeur de fallback
    return fallback;
  }
}
