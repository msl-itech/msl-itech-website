import { Component, OnDestroy, OnInit, AfterViewInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { OdooService } from '../services/odoo.service';
import { RecaptchaService } from '../services/recaptcha.service';

@Component({
  selector: 'app-demo-reservation',
  templateUrl: './demo-reservation.component.html',
  styleUrls: ['./demo-reservation.component.css'],
})
export class DemoReservationComponent implements OnInit, OnDestroy, AfterViewInit {
  // Gestion des étapes
  currentStep: number = 1;
  totalSteps: number = 5;
  stepTitles: string[] = [];
  private langChangeSubscription?: Subscription;

  // Informations de contact de base
  contact_name: string = '';
  phone: string = '+237';
  email_from: string = '';
  company: string = '';
  isLoading = false;

  // Question 1: Objectifs principaux (choix multiple)
  objectifs = {
    automatiser: false,
    centraliser: false,
    collaboration: false,
    remplacer: false,
    autre: false,
  };
  objectifRemplacerDetail: string = '';
  objectifAutreDetail: string = '';

  // Question 2: Processus qui prennent le plus de temps (cases à cocher)
  processusTemps = {
    leadsDevis: false,
    suiviCommandes: false,
    reporting: false,
    gestionStocks: false,
    autre: false,
  };
  processusAutreDetail: string = '';

  // Question 3: Outils actuels
  outilsActuels = {
    excel: false,
    zoho: false,
    sage: false,
    autre: false,
  };
  outilsAutreDetail: string = '';

  // Question 4: Plus gros défi opérationnel (menu déroulant)
  defiOperationnel: string = '';
  defisOptions: Array<{ value: string; label: string }> = [];
  defiAutreDetail: string = '';

  // Question bonus
  problemePrincipal: string = '';

  constructor(
    private odooService: OdooService,
    private toastr: ToastrService,
    private translate: TranslateService,
    private recaptchaService: RecaptchaService
  ) { }

  ngOnInit(): void {
    this.loadTranslations();
    this.langChangeSubscription = this.translate.onLangChange.subscribe(() => {
      this.loadTranslations();
    });
  }

  ngAfterViewInit(): void {
    // Rendre le widget reCAPTCHA après l'initialisation de la vue
    this.recaptchaService.renderRecaptcha('recaptcha-widget-demo');
  }

  ngOnDestroy(): void {
    if (this.langChangeSubscription) {
      this.langChangeSubscription.unsubscribe();
    }
  }

  private loadTranslations(): void {
    // Charger les titres des étapes
    this.stepTitles = [
      this.translate.instant('PAGES.DEMO_RESERVATION.STEPS.TITLES.COORDINATES'),
      this.translate.instant('PAGES.DEMO_RESERVATION.STEPS.TITLES.OBJECTIVES'),
      this.translate.instant('PAGES.DEMO_RESERVATION.STEPS.TITLES.PROCESSES'),
      this.translate.instant('PAGES.DEMO_RESERVATION.STEPS.TITLES.TOOLS'),
      this.translate.instant('PAGES.DEMO_RESERVATION.STEPS.TITLES.CHALLENGES'),
    ];

    // Charger les options de défis
    this.defisOptions = [
      {
        value: '',
        label: this.translate.instant(
          'PAGES.DEMO_RESERVATION.STEP5.SELECT_CHALLENGE'
        ),
      },
      {
        value: 'doublons',
        label: this.translate.instant(
          'PAGES.DEMO_RESERVATION.STEP5.CHALLENGES.DUPLICATES'
        ),
      },
      {
        value: 'visibilite',
        label: this.translate.instant(
          'PAGES.DEMO_RESERVATION.STEP5.CHALLENGES.VISIBILITY'
        ),
      },
      {
        value: 'couts',
        label: this.translate.instant(
          'PAGES.DEMO_RESERVATION.STEP5.CHALLENGES.COSTS'
        ),
      },
      {
        value: 'manuels',
        label: this.translate.instant(
          'PAGES.DEMO_RESERVATION.STEP5.CHALLENGES.MANUAL'
        ),
      },
      {
        value: 'autre',
        label: this.translate.instant(
          'PAGES.DEMO_RESERVATION.STEP5.CHALLENGES.OTHER'
        ),
      },
    ];
  }

  // Navigation entre les étapes
  nextStep(): void {
    if (this.validateCurrentStepWithMessage()) {
      if (this.currentStep < this.totalSteps) {
        this.currentStep++;
      }
    }
  }

  prevStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  goToStep(step: number): void {
    if (step <= this.currentStep || this.validateStepsUpToSilent(step - 1)) {
      this.currentStep = step;
    }
  }

  // Validation silencieuse (pour les boutons et états)
  validateCurrentStep(): boolean {
    switch (this.currentStep) {
      case 1:
        return this.validateContactInfoSilent();
      case 2:
        return this.validateObjectifsSilent();
      case 3:
        return this.validateProcessusSilent();
      case 4:
        return this.validateOutilsSilent();
      case 5:
        return this.validateDefiSilent();
      default:
        return true;
    }
  }

  // Validation avec messages d'erreur (pour les actions utilisateur)
  validateCurrentStepWithMessage(): boolean {
    switch (this.currentStep) {
      case 1:
        return this.validateContactInfoWithMessage();
      case 2:
        return this.validateObjectifsWithMessage();
      case 3:
        return this.validateProcessusWithMessage();
      case 4:
        return this.validateOutilsWithMessage();
      case 5:
        return this.validateDefiWithMessage();
      default:
        return true;
    }
  }

  // Validations silencieuses
  validateContactInfoSilent(): boolean {
    return !!(
      this.contact_name &&
      this.company &&
      this.email_from &&
      this.phone
    );
  }

  validateObjectifsSilent(): boolean {
    const hasObjectif = Object.values(this.objectifs).some((value) => value);
    if (!hasObjectif) return false;
    if (this.objectifs.remplacer && !this.objectifRemplacerDetail.trim())
      return false;
    if (this.objectifs.autre && !this.objectifAutreDetail.trim()) return false;
    return true;
  }

  validateProcessusSilent(): boolean {
    const hasProcessus = Object.values(this.processusTemps).some(
      (value) => value
    );
    if (!hasProcessus) return false;
    if (this.processusTemps.autre && !this.processusAutreDetail.trim())
      return false;
    return true;
  }

  validateOutilsSilent(): boolean {
    const hasOutil = Object.values(this.outilsActuels).some((value) => value);
    if (!hasOutil) return false;
    if (this.outilsActuels.autre && !this.outilsAutreDetail.trim())
      return false;
    return true;
  }

  validateDefiSilent(): boolean {
    if (!this.defiOperationnel) return false;
    if (this.defiOperationnel === 'autre' && !this.defiAutreDetail.trim())
      return false;
    return true;
  }

  // Validations avec messages d'erreur
  validateContactInfoWithMessage(): boolean {
    const isValid = this.validateContactInfoSilent();
    if (!isValid) {
      this.toastr.error(
        this.translate.instant(
          'PAGES.DEMO_RESERVATION.VALIDATION.FILL_REQUIRED'
        ),
        this.translate.instant(
          'PAGES.DEMO_RESERVATION.STEPS.TITLES.COORDINATES'
        )
      );
    }
    return isValid;
  }

  validateObjectifsWithMessage(): boolean {
    const hasObjectif = Object.values(this.objectifs).some((value) => value);
    if (!hasObjectif) {
      this.toastr.error(
        this.translate.instant(
          'PAGES.DEMO_RESERVATION.VALIDATION.SELECT_OBJECTIVE'
        ),
        this.translate.instant('PAGES.DEMO_RESERVATION.STEPS.TITLES.OBJECTIVES')
      );
      return false;
    }
    if (this.objectifs.remplacer && !this.objectifRemplacerDetail.trim()) {
      this.toastr.error(
        this.translate.instant(
          'PAGES.DEMO_RESERVATION.VALIDATION.FILL_REPLACEMENT'
        ),
        this.translate.instant('PAGES.DEMO_RESERVATION.STEPS.TITLES.OBJECTIVES')
      );
      return false;
    }
    if (this.objectifs.autre && !this.objectifAutreDetail.trim()) {
      this.toastr.error(
        this.translate.instant(
          'PAGES.DEMO_RESERVATION.VALIDATION.FILL_OTHER_OBJECTIVE'
        ),
        this.translate.instant('PAGES.DEMO_RESERVATION.STEPS.TITLES.OBJECTIVES')
      );
      return false;
    }
    return true;
  }

  validateProcessusWithMessage(): boolean {
    const hasProcessus = Object.values(this.processusTemps).some(
      (value) => value
    );
    if (!hasProcessus) {
      this.toastr.error(
        this.translate.instant(
          'PAGES.DEMO_RESERVATION.VALIDATION.SELECT_PROCESS'
        ),
        this.translate.instant('PAGES.DEMO_RESERVATION.STEPS.TITLES.PROCESSES')
      );
      return false;
    }
    if (this.processusTemps.autre && !this.processusAutreDetail.trim()) {
      this.toastr.error(
        this.translate.instant(
          'PAGES.DEMO_RESERVATION.VALIDATION.FILL_OTHER_PROCESS'
        ),
        this.translate.instant('PAGES.DEMO_RESERVATION.STEPS.TITLES.PROCESSES')
      );
      return false;
    }
    return true;
  }

  validateOutilsWithMessage(): boolean {
    const hasOutil = Object.values(this.outilsActuels).some((value) => value);
    if (!hasOutil) {
      this.toastr.error(
        this.translate.instant('PAGES.DEMO_RESERVATION.VALIDATION.SELECT_TOOL'),
        this.translate.instant('PAGES.DEMO_RESERVATION.STEPS.TITLES.TOOLS')
      );
      return false;
    }
    if (this.outilsActuels.autre && !this.outilsAutreDetail.trim()) {
      this.toastr.error(
        this.translate.instant(
          'PAGES.DEMO_RESERVATION.VALIDATION.FILL_OTHER_TOOL'
        ),
        this.translate.instant('PAGES.DEMO_RESERVATION.STEPS.TITLES.TOOLS')
      );
      return false;
    }
    return true;
  }

  validateDefiWithMessage(): boolean {
    if (!this.defiOperationnel) {
      this.toastr.error(
        this.translate.instant(
          'PAGES.DEMO_RESERVATION.STEP5.VALIDATION.SELECT_CHALLENGE'
        ),
        this.translate.instant('PAGES.DEMO_RESERVATION.STEPS.TITLES.CHALLENGES')
      );
      return false;
    }
    if (this.defiOperationnel === 'autre' && !this.defiAutreDetail.trim()) {
      this.toastr.error(
        this.translate.instant(
          'PAGES.DEMO_RESERVATION.STEP5.OTHER_PLACEHOLDER'
        ),
        this.translate.instant('PAGES.DEMO_RESERVATION.STEPS.TITLES.CHALLENGES')
      );
      return false;
    }
    return true;
  }

  validateStepsUpToSilent(step: number): boolean {
    for (let i = 1; i <= step; i++) {
      const currentStepBackup = this.currentStep;
      this.currentStep = i;
      const isValid = this.validateCurrentStep();
      this.currentStep = currentStepBackup;
      if (!isValid) {
        return false;
      }
    }
    return true;
  }

  // Méthodes pour obtenir les sélections
  getSelectedObjectifs(): string[] {
    const selected: string[] = [];
    if (this.objectifs.automatiser)
      selected.push('Automatiser les processus (factures, stocks, ventes)');
    if (this.objectifs.centraliser)
      selected.push('Centraliser les données (CRM + Comptabilité + Projets)');
    if (this.objectifs.collaboration)
      selected.push('Améliorer la collaboration entre équipes');
    if (this.objectifs.remplacer)
      selected.push(
        `Remplacer un outil inefficace: ${this.objectifRemplacerDetail}`
      );
    if (this.objectifs.autre)
      selected.push(`Autre: ${this.objectifAutreDetail}`);
    return selected;
  }

  getSelectedProcessus(): string[] {
    const selected: string[] = [];
    if (this.processusTemps.leadsDevis)
      selected.push("Gestion des leads/devis (ex : perte d'opportunités)");
    if (this.processusTemps.suiviCommandes)
      selected.push('Suivi des commandes/clients (ex : relances manuelles)');
    if (this.processusTemps.reporting)
      selected.push("Reporting financier ou d'activité");
    if (this.processusTemps.gestionStocks)
      selected.push('Gestion des stocks (ex : ruptures, surstocks)');
    if (this.processusTemps.autre)
      selected.push(`Autre: ${this.processusAutreDetail}`);
    return selected;
  }

  getSelectedOutils(): string[] {
    const selected: string[] = [];
    if (this.outilsActuels.excel) selected.push('Excel');
    if (this.outilsActuels.zoho) selected.push('Zoho CRM');
    if (this.outilsActuels.sage) selected.push('Sage Comptabilité');
    if (this.outilsActuels.autre)
      selected.push(`Autre: ${this.outilsAutreDetail}`);
    return selected;
  }

  getDefiOperationnel(): string {
    if (this.defiOperationnel === 'autre') {
      return this.defiAutreDetail;
    }
    const defi = this.defisOptions.find(
      (d) => d.value === this.defiOperationnel
    );
    return defi ? defi.label : '';
  }

  // Calcul du pourcentage de progression
  getProgressPercentage(): number {
    return Math.round((this.currentStep / this.totalSteps) * 100);
  }

  // Vérifier si une étape est complétée (silencieux)
  isStepCompleted(step: number): boolean {
    if (step > this.currentStep) return false;

    const currentStepBackup = this.currentStep;
    this.currentStep = step;
    const isValid = this.validateCurrentStep();
    this.currentStep = currentStepBackup;
    return isValid;
  }

  async onSubmit(form: NgForm): Promise<void> {
    if (!this.validateStepsUpToSilent(this.totalSteps)) {
      this.toastr.error('Veuillez compléter toutes les étapes', 'Erreur');
      return;
    }

    // Vérification reCAPTCHA v2
    const recaptchaToken = this.recaptchaService.getResponse();
    if (!recaptchaToken) {
      this.toastr.error('Veuillez cocher la case reCAPTCHA', 'Erreur');
      return;
    }

    this.isLoading = true;

    // Assemblage de la description complète avec HTML amélioré
    const descriptionParts = [
      `<h3>🎬 Demande de démonstration Odoo</h3>`,

      // Section 1: Informations de contact
      `<div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #114d5a;">`,
      `<h4 style="color: #114d5a; margin-top: 0;">🏢 1. Informations de contact</h4>`,
      `<table style="width: 100%; border-collapse: collapse;">`,
      `<tr><td style="padding: 5px 10px; color: #6c757d;">Société:</td><td style="padding: 5px 10px;"><strong>${this.company}</strong></td></tr>`,
      `<tr><td style="padding: 5px 10px; color: #6c757d;">Nom:</td><td style="padding: 5px 10px;"><strong>${this.contact_name}</strong></td></tr>`,
      `<tr><td style="padding: 5px 10px; color: #6c757d;">Email:</td><td style="padding: 5px 10px;"><a href="mailto:${this.email_from}">${this.email_from}</a></td></tr>`,
      `<tr><td style="padding: 5px 10px; color: #6c757d;">Téléphone:</td><td style="padding: 5px 10px;"><a href="tel:${this.phone}">${this.phone}</a></td></tr>`,
      `</table>`,
      `</div>`,

      // Section 2: Objectifs
      `<div style="background: #d4edda; padding: 15px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #28a745;">`,
      `<h4 style="color: #28a745; margin-top: 0;">🎯 2. Objectifs principaux avec Odoo</h4>`,
      `<ul style="margin: 0; padding-left: 20px;">`,
      ...this.getSelectedObjectifs().map(obj => `<li style="margin: 5px 0;">${obj}</li>`),
      `</ul>`,
      `</div>`,

      // Section 3: Processus chronophages
      `<div style="background: #fff3cd; padding: 15px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #ffc107;">`,
      `<h4 style="color: #856404; margin-top: 0;">⏱️ 3. Processus qui prennent le plus de temps</h4>`,
      `<ul style="margin: 0; padding-left: 20px;">`,
      ...this.getSelectedProcessus().map(proc => `<li style="margin: 5px 0;">${proc}</li>`),
      `</ul>`,
      `</div>`,

      // Section 4: Outils actuels
      `<div style="background: #e7f5ff; padding: 15px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #0d6efd;">`,
      `<h4 style="color: #0d6efd; margin-top: 0;">🛠️ 4. Outils actuellement utilisés</h4>`,
      `<p style="margin: 0;">`,
      ...this.getSelectedOutils().map(outil => `<span style="background: #0d6efd; color: white; padding: 3px 10px; border-radius: 12px; font-size: 12px; margin: 2px; display: inline-block;">${outil}</span>`),
      `</p>`,
      `</div>`,

      // Section 5: Défi opérationnel
      `<div style="background: #f8d7da; padding: 15px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #dc3545;">`,
      `<h4 style="color: #dc3545; margin-top: 0;">🚧 5. Principal défi opérationnel</h4>`,
      `<p style="margin: 0; font-size: 16px;"><strong>${this.getDefiOperationnel()}</strong></p>`,
      `</div>`,
    ];

    // Section bonus si remplie
    if (this.problemePrincipal.trim()) {
      descriptionParts.push(
        `<div style="background: #e2e3e5; padding: 15px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #6c757d;">`,
        `<h4 style="color: #495057; margin-top: 0;">✨ Problème principal à résoudre</h4>`,
        `<p style="margin: 0; white-space: pre-wrap; line-height: 1.6;">${this.problemePrincipal}</p>`,
        `</div>`
      );
    }

    descriptionParts.push(
      `<hr style="margin: 20px 0; border: none; border-top: 1px solid #ddd;">`,
      `<p style="color: #6c757d; font-size: 12px; text-align: center;">`,
      `<em>📅 Demande de démo reçue le ${new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</em>`,
      `</p>`
    );

    const fullDescription = descriptionParts.join('');

    // Créer l'objet de données pour l'envoi
    const leadData = {
      name: `🎬 Démo Odoo - ${this.contact_name} (${this.company})`,
      phone: this.phone,
      email_from: this.email_from,
      description: fullDescription,
      recaptcha_token: recaptchaToken
    };

    this.odooService.createLead(leadData).subscribe({
      next: (response) => {
        this.toastr.success(
          'Votre demande de démonstration a été envoyée avec succès',
          'Succès'
        );
        this.resetForm(form);
        this.recaptchaService.resetRecaptcha();
        this.isLoading = false;
      },
      error: (error) => {
        this.toastr.error(
          "Une erreur est survenue lors de l'envoi de la demande",
          'Erreur'
        );
        this.recaptchaService.resetRecaptcha();
        this.isLoading = false;
      },
    });
  }

  resetForm(form: NgForm): void {
    form.resetForm();
    this.currentStep = 1;
    this.phone = '+237';

    // Réinitialiser les objectifs
    Object.keys(this.objectifs).forEach((key) => {
      this.objectifs[key as keyof typeof this.objectifs] = false;
    });
    this.objectifRemplacerDetail = '';
    this.objectifAutreDetail = '';

    // Réinitialiser les processus
    Object.keys(this.processusTemps).forEach((key) => {
      this.processusTemps[key as keyof typeof this.processusTemps] = false;
    });
    this.processusAutreDetail = '';

    // Réinitialiser les outils
    Object.keys(this.outilsActuels).forEach((key) => {
      this.outilsActuels[key as keyof typeof this.outilsActuels] = false;
    });
    this.outilsAutreDetail = '';

    // Réinitialiser le défi et le problème principal
    this.defiOperationnel = '';
    this.defiAutreDetail = '';
    this.problemePrincipal = '';
  }
}
