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
  contact_name: string = '';
  phone: string = '+237';
  email_from: string = '';
  company: string = '';
  subject: string = '';
  description: string = '';
  description_produits: string = '';
  contexte: string = '';
  scenario: string = '';
  isLoading = false;
  selectedFile: File | null = null;

  modules = {
    crm: false,
    comptabilite: false,
    pointVente: false,
    siteWeb: false,
    evenements: false,
    rh: false,
    recrutement: false,
    ventes: false,
    inventaire: false,
    projets: false,
    ventesB2B: false,
    sondages: false,
    depenses: false,
    tableauxBords: false,
    achats: false,
    mrp: false,
    feuilleTemps: false,
    ventesB2C: false,
    formations: false,
    absencesConges: false,
  };

  constructor(
    private odooService: OdooService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {}

  onFileSelected(event: any): void {
    if (event.target.files && event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];
    }
  }

  getSelectedModules(): string {
    const selectedModules = Object.entries(this.modules)
      .filter(([_, isSelected]) => isSelected)
      .map(([moduleName, _]) => {
        const moduleNames: { [key: string]: string } = {
          crm: 'GRP (CRM)',
          comptabilite: 'Comptabilité',
          pointVente: 'Point de Ventes',
          siteWeb: 'Site web',
          evenements: 'Événements',
          rh: 'RH',
          recrutement: 'Recrutement',
          ventes: 'Ventes',
          inventaire: 'Inventaire',
          projets: 'Projets',
          ventesB2B: 'Ventes en Ligne B2B',
          sondages: 'Sondages',
          depenses: 'Dépenses',
          tableauxBords: 'Tableaux de Bords/KPIs',
          achats: 'Achats',
          mrp: 'MRP',
          feuilleTemps: 'Feuilles de Temps',
          ventesB2C: 'Ventes en Ligne B2C',
          formations: 'Formations',
          absencesConges: 'Absences/Congés',
        };
        return moduleNames[moduleName] || moduleName;
      });

    return selectedModules.length > 0
      ? selectedModules.map((module) => `- ${module}`).join('\n')
      : 'Aucun module sélectionné';
  }

  onSubmit(form: NgForm): void {
    if (form.invalid) {
      this.toastr.error('Veuillez remplir tous les champs requis', 'Erreur');
      return;
    }

    this.isLoading = true;

    // Assemblage de la description complète avec des paragraphes HTML
    const descriptionParts = [
      `<p>Société: ${this.company}</p>`,
      `<p>Sujet: ${this.subject}</p>`,
      `<p>Message: ${this.description}</p>`,
      `<p>Description des produits & services: ${
        this.description_produits || 'Non fourni'
      }</p>`,
      `<p>Contexte: ${this.contexte || 'Non fourni'}</p>`,
      `<p>Scénario: ${this.scenario || 'Non fourni'}</p>`,
      `<p>Modules sélectionnés:</p><ul>${this.getSelectedModulesHTML()}</ul>`,
    ];

    const fullDescription = descriptionParts.join('');

    // Créer un objet FormData pour inclure le fichier
    const formData = new FormData();
    formData.append('name', this.contact_name);
    formData.append('phone', this.phone);
    formData.append('email_from', this.email_from);
    formData.append('description', fullDescription);

    // Ajouter le fichier s'il existe
    if (this.selectedFile) {
      formData.append('file', this.selectedFile);
    }

    this.odooService.createLeadWithFile(formData).subscribe({
      next: (response) => {
        this.toastr.success(
          'Votre demande de démonstration a été envoyée avec succès',
          'Succès'
        );
        form.resetForm();
        this.phone = '+237';
        this.selectedFile = null;
        // Réinitialiser les modules
        Object.keys(this.modules).forEach((key) => {
          this.modules[key as keyof typeof this.modules] = false;
        });
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

  getSelectedModulesHTML(): string {
    const selectedModules = Object.entries(this.modules)
      .filter(([_, isSelected]) => isSelected)
      .map(([moduleName, _]) => {
        const moduleNames: { [key: string]: string } = {
          crm: 'GRP (CRM)',
          comptabilite: 'Comptabilité',
          pointVente: 'Point de Ventes',
          siteWeb: 'Site web',
          evenements: 'Événements',
          rh: 'RH',
          recrutement: 'Recrutement',
          ventes: 'Ventes',
          inventaire: 'Inventaire',
          projets: 'Projets',
          ventesB2B: 'Ventes en Ligne B2B',
          sondages: 'Sondages',
          depenses: 'Dépenses',
          tableauxBords: 'Tableaux de Bords/KPIs',
          achats: 'Achats',
          mrp: 'MRP',
          feuilleTemps: 'Feuilles de Temps',
          ventesB2C: 'Ventes en Ligne B2C',
          formations: 'Formations',
          absencesConges: 'Absences/Congés',
        };
        return moduleNames[moduleName] || moduleName;
      });

    return selectedModules.length > 0
      ? selectedModules.map((module) => `<li>${module}</li>`).join('')
      : '<li>Aucun module sélectionné</li>';
  }
}
