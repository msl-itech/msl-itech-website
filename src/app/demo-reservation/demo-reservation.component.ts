import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { OdooService } from '../services/odoo.service';

@Component({
  selector: 'app-demo-reservation',
  templateUrl: './demo-reservation.component.html',
  styleUrls: ['./demo-reservation.component.css'],
})
export class DemoReservationComponent implements OnInit {
  // Gestion des étapes
  currentStep: number = 1;
  totalSteps: number = 5;
  stepTitles = [
    'Vos coordonnées',
    'Vos objectifs',
    'Vos processus',
    'Vos outils',
    'Finalisation',
  ];

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
  defisOptions = [
    { value: '', label: 'Sélectionnez votre principal défi...' },
    { value: 'doublons', label: 'Doublons de saisie' },
    { value: 'visibilite', label: 'Manque de visibilité en temps réel' },
    { value: 'couts', label: 'Coûts cachés des outils multiples' },
    { value: 'manuels', label: 'Processus trop manuels' },
    { value: 'autre', label: 'Autre...' },
  ];
  defiAutreDetail: string = '';

  // Question bonus
  problemePrincipal: string = '';

  constructor(
    private odooService: OdooService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {}

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
      this.toastr.error('Veuillez remplir tous les champs requis', 'Étape 1');
    }
    return isValid;
  }

  validateObjectifsWithMessage(): boolean {
    const hasObjectif = Object.values(this.objectifs).some((value) => value);
    if (!hasObjectif) {
      this.toastr.error(
        'Veuillez sélectionner au moins un objectif',
        'Étape 2'
      );
      return false;
    }
    if (this.objectifs.remplacer && !this.objectifRemplacerDetail.trim()) {
      this.toastr.error("Veuillez préciser l'outil à remplacer", 'Étape 2');
      return false;
    }
    if (this.objectifs.autre && !this.objectifAutreDetail.trim()) {
      this.toastr.error('Veuillez préciser votre objectif', 'Étape 2');
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
        'Veuillez sélectionner au moins un processus',
        'Étape 3'
      );
      return false;
    }
    if (this.processusTemps.autre && !this.processusAutreDetail.trim()) {
      this.toastr.error('Veuillez préciser le processus', 'Étape 3');
      return false;
    }
    return true;
  }

  validateOutilsWithMessage(): boolean {
    const hasOutil = Object.values(this.outilsActuels).some((value) => value);
    if (!hasOutil) {
      this.toastr.error('Veuillez sélectionner au moins un outil', 'Étape 4');
      return false;
    }
    if (this.outilsActuels.autre && !this.outilsAutreDetail.trim()) {
      this.toastr.error("Veuillez préciser l'outil", 'Étape 4');
      return false;
    }
    return true;
  }

  validateDefiWithMessage(): boolean {
    if (!this.defiOperationnel) {
      this.toastr.error(
        'Veuillez sélectionner votre principal défi',
        'Étape 5'
      );
      return false;
    }
    if (this.defiOperationnel === 'autre' && !this.defiAutreDetail.trim()) {
      this.toastr.error('Veuillez préciser votre défi', 'Étape 5');
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

  onSubmit(form: NgForm): void {
    if (!this.validateStepsUpToSilent(this.totalSteps)) {
      this.toastr.error('Veuillez compléter toutes les étapes', 'Erreur');
      return;
    }

    this.isLoading = true;

    // Assemblage de la description complète
    const descriptionParts = [
      `<h3>Informations de contact</h3>`,
      `<p><strong>Société:</strong> ${this.company}</p>`,
      `<p><strong>Nom:</strong> ${this.contact_name}</p>`,
      `<p><strong>Téléphone:</strong> ${this.phone}</p>`,
      `<p><strong>Email:</strong> ${this.email_from}</p>`,

      `<h3>🎯 Objectifs principaux avec Odoo</h3>`,
      `<ul>${this.getSelectedObjectifs()
        .map((obj) => `<li>${obj}</li>`)
        .join('')}</ul>`,

      `<h3>🔍 Processus qui prennent le plus de temps</h3>`,
      `<ul>${this.getSelectedProcessus()
        .map((proc) => `<li>${proc}</li>`)
        .join('')}</ul>`,

      `<h3>🛠️ Outils actuellement utilisés</h3>`,
      `<ul>${this.getSelectedOutils()
        .map((outil) => `<li>${outil}</li>`)
        .join('')}</ul>`,

      `<h3>🚧 Principal défi opérationnel</h3>`,
      `<p>${this.getDefiOperationnel()}</p>`,
    ];

    if (this.problemePrincipal.trim()) {
      descriptionParts.push(
        `<h3>✨ Problème principal à résoudre</h3>`,
        `<p>${this.problemePrincipal}</p>`
      );
    }

    const fullDescription = descriptionParts.join('');

    // Créer l'objet de données pour l'envoi
    const leadData = {
      name: this.contact_name,
      phone: this.phone,
      email_from: this.email_from,
      description: fullDescription,
    };

    this.odooService.createLead(leadData).subscribe({
      next: (response) => {
        this.toastr.success(
          'Votre demande de démonstration a été envoyée avec succès',
          'Succès'
        );
        this.resetForm(form);
        this.isLoading = false;
      },
      error: (error) => {
        this.toastr.error(
          "Une erreur est survenue lors de l'envoi de la demande",
          'Erreur'
        );
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
