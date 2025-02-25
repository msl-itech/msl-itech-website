import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { OdooService } from '../services/odoo.service';

@Component({
  selector: 'app-reservation-horeca',
  templateUrl: './reservation-horeca.component.html',
  styleUrls: ['./reservation-horeca.component.css']
})
export class ReservationHorecaComponent {
  isLoading = false;
  formData = {
    establishment_name: '',
    contact_name: '',
    email: '',
    phone: '',
    demo_format: '',
    country: '',
    city: '',
    address: ''
  };

  constructor(
    private odooService: OdooService,
    private toastr: ToastrService
  ) {}

  onSubmit(form: NgForm): void {
    if (form.invalid) {
      this.toastr.error('Veuillez remplir tous les champs requis', 'Erreur');
      return;
    }

    this.isLoading = true;

    const descriptionParts = [
      `Nom de l'établissement: ${this.formData.establishment_name}`,
      `Format de la démo: ${this.formData.demo_format}`,
      `Pays: ${this.formData.country}`,
      `Ville: ${this.formData.city}`,
      `Adresse: ${this.formData.address}`
    ];

    const leadData = {
      name: this.formData.contact_name,
      phone: this.formData.phone,
      email_from: this.formData.email,
      description: descriptionParts.join('\n')
    };

    this.odooService.createLead(leadData).subscribe({
      next: () => {
        this.toastr.success('Votre demande de démonstration a été envoyée avec succès', 'Succès');
        form.resetForm();
        this.isLoading = false;
      },
      error: () => {
        this.toastr.error('Une erreur est survenue lors de l\'envoi de la demande', 'Erreur');
        this.isLoading = false;
      }
    });
  }
} 