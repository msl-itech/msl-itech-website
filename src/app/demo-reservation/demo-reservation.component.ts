import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { OdooService } from '../services/odoo.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-demo-reservation',
  templateUrl: './demo-reservation.component.html',
  styleUrls: ['./demo-reservation.component.css']
})
export class DemoReservationComponent implements OnInit {
  contact_name: string = '';
  phone: string = '+237';
  email_from: string = '';
  company: string = '';
  subject: string = '';
  description: string = '';
  isLoading = false;

  modules = {
    crm: false,
    marketing: false,
    achats: false,
    inventaire: false,
    projet: false,
    ecommerce: false,
    feuilleTemps: false,
    fabrication: false,
    comptabilite: false,
    siteWeb: false,
    autres: false
  };

  constructor(
    private odooService: OdooService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {}

  getSelectedModules(): string {
    const selectedModules = Object.entries(this.modules)
      .filter(([_, isSelected]) => isSelected)
      .map(([moduleName, _]) => {
        const moduleNames: { [key: string]: string } = {
          crm: 'CRM',
          marketing: 'Marketing',
          achats: 'Achats',
          inventaire: 'Inventaire',
          projet: 'Projet',
          ecommerce: 'E-Commerce',
          feuilleTemps: 'Feuille de Temps',
          fabrication: 'Fabrication',
          comptabilite: 'Comptabilité',
          siteWeb: 'Site Web',
          autres: 'Autres'
        };
        return moduleNames[moduleName] || moduleName;
      });

    return selectedModules.length > 0 
      ? selectedModules.map(module => `- ${module}`).join('\n')
      : 'Aucun module sélectionné';
  }

  onSubmit(form: NgForm): void {
    if (form.invalid) {
      this.toastr.error('Veuillez remplir tous les champs requis', 'Erreur');
      return;
    }

    this.isLoading = true;
    const formValue = form.value;

    // Assemblage de la description complète avec des retours à la ligne
    const descriptionParts = [
      `Société: ${this.company}\n\n`,
      `Sujet: ${this.subject}\n\n`,
      `Message: ${this.description}\n\n`,
      `\nModules sélectionnés:\n${this.getSelectedModules()}`
    ];

    const fullDescription = descriptionParts.join('\n');

    const leadData = {
      name: this.contact_name,
      phone: this.phone,
      email_from: this.email_from,
      description: fullDescription
    };

    this.odooService.createLead(leadData).subscribe({
      next: (response) => {
        this.toastr.success('Votre demande de démonstration a été envoyée avec succès', 'Succès');
        form.resetForm();
        this.phone = '+237';
        // Réinitialiser les modules
        Object.keys(this.modules).forEach(key => {
          this.modules[key as keyof typeof this.modules] = false;
        });
        this.isLoading = false;
      },
      error: (error) => {
        this.toastr.error('Une erreur est survenue lors de l\'envoi de la demande', 'Erreur');
        this.isLoading = false;
      }
    });
  }
} 