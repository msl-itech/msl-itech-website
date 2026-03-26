import { Component, OnInit, AfterViewInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ConsentService } from '../services/consent.service';
import { OdooService } from '../services/odoo.service';
import { RecaptchaService } from '../services/recaptcha.service';

@Component({
  selector: 'app-devenir-partenaire',
  templateUrl: './devenir-partenaire.component.html',
  styleUrl: './devenir-partenaire.component.css',
})
export class DevenirPartenaireComponent implements OnInit, AfterViewInit {
  // Gestion des étapes
  currentStep: number = 1;
  totalSteps: number = 6;
  stepTitles: string[] = [
    'Informations personnelles',
    'Votre profil professionnel',
    'Votre spécialité/expertise',
    "Votre expérience",
    'Vos clients',
    'Finalisation',
  ];

  // Étape 1: Informations personnelles
  contact_name: string = '';
  role: string = '';
  email_from: string = '';
  phone: string = '';
  country: string = '';
  isLoading = false;

  // Étape 2: Type de profil
  profileTypes = {
    consultant: false,
    comptable: false,
    agenceWeb: false,
    chambreCommerce: false,
    influenceur: false,
    autre: false,
  };
  profileAutreDetail: string = '';

  // Étape 3: Spécialité/expertise
  specialites = {
    marketing: false,
    developpement: false,
    finance: false,
    commercial: false,
    contenu: false,
    autre: false,
  };
  specialiteAutreDetail: string = '';
  experience: string = '';

  // Étape 4: Secteurs/clients
  secteurs = {
    startups: false,
    pmeTpe: false,
    ecommerce: false,
    servicesB2b: false,
    hotellerie: false,
    autre: false,
  };
  secteurAutreDetail: string = '';

  // Étape 5: Message libre
  message: string = '';
  privacyConsent: boolean = false;

  // Options pour les menus déroulants
  experienceOptions = [
    { value: '0-2', label: '0 à 2 ans' },
    { value: '3-5', label: '3 à 5 ans' },
    { value: '6-10', label: '6 à 10 ans' },
    { value: '10+', label: '10 ans et plus' },
  ];


  constructor(
    private odooService: OdooService,
    private toastr: ToastrService,
    private consentService: ConsentService,
    private recaptchaService: RecaptchaService
  ) { }

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    // Rendre le widget reCAPTCHA après l'initialisation de la vue
    this.recaptchaService.renderRecaptcha('recaptcha-widget-partner');
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

  // Validation silencieuse
  validateCurrentStep(): boolean {
    switch (this.currentStep) {
      case 1:
        return this.validatePersonalInfoSilent();
      case 2:
        return this.validateProfileSilent();
      case 3:
        return this.validateExpertiseSilent();
      case 4:
        return this.validateExperienceSilent();
      case 5:
        return this.validateClientsSilent();
      case 6:
        return this.validateFinalizationSilent();
      default:
        return true;
    }
  }

  // Validation avec messages
  validateCurrentStepWithMessage(): boolean {
    switch (this.currentStep) {
      case 1:
        return this.validatePersonalInfoWithMessage();
      case 2:
        return this.validateProfileWithMessage();
      case 3:
        return this.validateExpertiseWithMessage();
      case 4:
        return this.validateExperienceWithMessage();
      case 5:
        return this.validateClientsWithMessage();
      case 6:
        return this.validateFinalizationWithMessage();
      default:
        return true;
    }
  }

  // Validations silencieuses par étape
  validatePersonalInfoSilent(): boolean {
    return !!(
      this.contact_name &&
      this.role &&
      this.email_from &&
      this.phone &&
      this.country
    );
  }

  validateProfileSilent(): boolean {
    const hasProfile = Object.values(this.profileTypes).some((value) => value);
    if (!hasProfile) return false;
    if (this.profileTypes.autre && !this.profileAutreDetail.trim())
      return false;
    return true;
  }


  validateExpertiseSilent(): boolean {
    const hasSpecialite = Object.values(this.specialites).some(
      (value) => value
    );
    if (!hasSpecialite) return false;
    if (this.specialites.autre && !this.specialiteAutreDetail.trim())
      return false;
    return true;
  }

  validateExperienceSilent(): boolean {
    return !!this.experience;
  }

  validateClientsSilent(): boolean {
    const hasSecteur = Object.values(this.secteurs).some((value) => value);
    if (!hasSecteur) return false;
    if (this.secteurs.autre && !this.secteurAutreDetail.trim()) return false;
    return true;
  }


  validateFinalizationSilent(): boolean {
    return this.privacyConsent;
  }

  // Validations avec messages
  validatePersonalInfoWithMessage(): boolean {
    if (!this.validatePersonalInfoSilent()) {
      this.toastr.error(
        'Veuillez remplir tous les champs requis',
        'Informations personnelles'
      );
      return false;
    }
    return true;
  }

  validateProfileWithMessage(): boolean {
    const hasProfile = Object.values(this.profileTypes).some((value) => value);
    if (!hasProfile) {
      this.toastr.error(
        'Veuillez sélectionner au moins un type de profil',
        'Profil professionnel'
      );
      return false;
    }
    if (this.profileTypes.autre && !this.profileAutreDetail.trim()) {
      this.toastr.error(
        'Veuillez préciser votre type de profil',
        'Profil professionnel'
      );
      return false;
    }
    return true;
  }


  validateExpertiseWithMessage(): boolean {
    const hasSpecialite = Object.values(this.specialites).some(
      (value) => value
    );
    if (!hasSpecialite) {
      this.toastr.error(
        'Veuillez sélectionner au moins une spécialité',
        'Expertise'
      );
      return false;
    }
    if (this.specialites.autre && !this.specialiteAutreDetail.trim()) {
      this.toastr.error('Veuillez préciser votre spécialité', 'Expertise');
      return false;
    }
    return true;
  }

  validateExperienceWithMessage(): boolean {
    if (!this.experience) {
      this.toastr.error(
        "Veuillez sélectionner votre niveau d'expérience",
        'Expérience'
      );
      return false;
    }
    return true;
  }

  validateClientsWithMessage(): boolean {
    const hasSecteur = Object.values(this.secteurs).some((value) => value);
    if (!hasSecteur) {
      this.toastr.error(
        'Veuillez sélectionner au moins un secteur client',
        'Vos clients'
      );
      return false;
    }
    if (this.secteurs.autre && !this.secteurAutreDetail.trim()) {
      this.toastr.error('Veuillez préciser le secteur', 'Vos clients');
      return false;
    }
    return true;
  }


  validateFinalizationWithMessage(): boolean {
    if (!this.privacyConsent) {
      this.toastr.error(
        'Veuillez accepter la politique de confidentialité',
        'Finalisation'
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

  // Calcul du pourcentage de progression
  getProgressPercentage(): number {
    return Math.round((this.currentStep / this.totalSteps) * 100);
  }

  // Vérifier si une étape est complétée
  isStepCompleted(step: number): boolean {
    if (step > this.currentStep) return false;
    const currentStepBackup = this.currentStep;
    this.currentStep = step;
    const isValid = this.validateCurrentStep();
    this.currentStep = currentStepBackup;
    return isValid;
  }

  // Méthodes pour obtenir les sélections
  getSelectedProfiles(): string[] {
    const selected: string[] = [];
    if (this.profileTypes.consultant)
      selected.push('Consultant ERP/IT freelance');
    if (this.profileTypes.comptable)
      selected.push('Expert-comptable / CFO externalisé');
    if (this.profileTypes.agenceWeb)
      selected.push('Agence web / marketing digital');
    if (this.profileTypes.chambreCommerce)
      selected.push('Chambre de commerce / incubateur');
    if (this.profileTypes.influenceur)
      selected.push('Influenceur LinkedIn / YouTube');
    if (this.profileTypes.autre)
      selected.push(`Autre: ${this.profileAutreDetail}`);
    return selected;
  }

  getSelectedSpecialites(): string[] {
    const selected: string[] = [];
    if (this.specialites.marketing)
      selected.push('Marketing digital / Social media');
    if (this.specialites.developpement) selected.push('Développement ERP / IT');
    if (this.specialites.finance)
      selected.push('Gestion financière / CFO externalisé');
    if (this.specialites.commercial)
      selected.push('Stratégie commerciale / Business development');
    if (this.specialites.contenu)
      selected.push('Création de contenu / Copywriting');
    if (this.specialites.autre)
      selected.push(`Autre: ${this.specialiteAutreDetail}`);
    return selected;
  }

  getSelectedSecteurs(): string[] {
    const selected: string[] = [];
    if (this.secteurs.startups) selected.push('Startups tech');
    if (this.secteurs.pmeTpe) selected.push('PME / TPE');
    if (this.secteurs.ecommerce) selected.push('E-commerce / Retail');
    if (this.secteurs.servicesB2b) selected.push('Services B2B');
    if (this.secteurs.hotellerie) selected.push('Hôtellerie / Tourisme');
    if (this.secteurs.autre) selected.push(`Autre: ${this.secteurAutreDetail}`);
    return selected;
  }

  getExperienceLabel(): string {
    const exp = this.experienceOptions.find((e) => e.value === this.experience);
    return exp ? exp.label : '';
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
      this.consentService.trackFormSubmission('partner_form', false);
      return;
    }

    this.isLoading = true;

    // Assemblage de la description complète
    const descriptionParts = [
      `<h3>🆔 Informations personnelles</h3>`,
      `<p><strong>Nom et prénom:</strong> ${this.contact_name}</p>`,
      `<p><strong>Fonction/Rôle:</strong> ${this.role}</p>`,
      `<p><strong>Email:</strong> ${this.email_from}</p>`,
      `<p><strong>Téléphone:</strong> ${this.phone}</p>`,
      `<p><strong>Pays:</strong> ${this.country}</p>`,

      `<h3>👔 Type de profil</h3>`,
      `<ul>${this.getSelectedProfiles()
        .map((profile) => `<li>${profile}</li>`)
        .join('')}</ul>`,

      `<h3>🎯 Spécialité/Expertise</h3>`,
      `<ul>${this.getSelectedSpecialites()
        .map((spec) => `<li>${spec}</li>`)
        .join('')}</ul>`,
      `<p><strong>Expérience:</strong> ${this.getExperienceLabel()}</p>`,

      `<h3>🏢 Secteurs clients</h3>`,
      `<ul>${this.getSelectedSecteurs()
        .map((secteur) => `<li>${secteur}</li>`)
        .join('')}</ul>`,
    ];

    if (this.message.trim()) {
      descriptionParts.push(
        `<h3>💬 Message/Questions</h3>`,
        `<p>${this.message}</p>`
      );
    }

    const fullDescription = descriptionParts.join('');

    const leadData = {
      name: this.contact_name,
      phone: this.phone,
      email_from: this.email_from,
      description: fullDescription,
      tags: ['Demande de partenariat'],
      recaptcha_token: recaptchaToken
    };

    this.odooService.createLead(leadData).subscribe({
      next: () => {
        this.toastr.success(
          'Votre candidature partenaire a été envoyée avec succès',
          'Succès'
        );
        this.consentService.trackFormSubmission('partner_form', true);
        this.resetForm(form);
        this.recaptchaService.resetRecaptcha();
        this.isLoading = false;
      },
      error: () => {
        this.toastr.error(
          "Une erreur est survenue lors de l'envoi de votre candidature",
          'Erreur'
        );
        this.consentService.trackFormSubmission('partner_form', false);
        this.recaptchaService.resetRecaptcha();
        this.isLoading = false;
      },
    });
  }

  resetForm(form: NgForm): void {
    form.resetForm();
    this.currentStep = 1;

    // Réinitialiser tous les objets
    Object.keys(this.profileTypes).forEach((key) => {
      this.profileTypes[key as keyof typeof this.profileTypes] = false;
    });
    Object.keys(this.specialites).forEach((key) => {
      this.specialites[key as keyof typeof this.specialites] = false;
    });
    Object.keys(this.secteurs).forEach((key) => {
      this.secteurs[key as keyof typeof this.secteurs] = false;
    });

    // Réinitialiser les champs
    this.profileAutreDetail = '';
    this.specialiteAutreDetail = '';
    this.secteurAutreDetail = '';
    this.experience = '';
    this.message = '';
    this.privacyConsent = false;
  }
}
