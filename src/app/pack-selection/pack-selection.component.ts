import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { OdooService } from '../services/odoo.service';

@Component({
  selector: 'app-pack-selection',
  templateUrl: './pack-selection.component.html',
  styleUrls: ['./pack-selection.component.css']
})
export class PackSelectionComponent {
  isLoading = false;
  formData = {
    contact_name: '',
    email: '',
    phone: '',
    packType: '',
    numberOfUsers: '',
    additionalInfo: ''
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
      `Type de Pack: ${this.formData.packType}`,
      `Nombre d'utilisateurs: ${this.formData.numberOfUsers}`,
      `Informations supplémentaires: ${this.formData.additionalInfo}`
    ];

    const leadData = {
      name: this.formData.contact_name,
      phone: this.formData.phone,
      email_from: this.formData.email,
      description: descriptionParts.join('\n')
    };

    this.odooService.createLead(leadData).subscribe({
      next: () => {
        this.toastr.success('Votre demande a été envoyée avec succès', 'Succès');
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