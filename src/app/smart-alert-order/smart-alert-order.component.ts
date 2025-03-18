import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { OdooService } from '../services/odoo.service';

@Component({
  selector: 'app-smart-alert-order',
  templateUrl: './smart-alert-order.component.html',
  styleUrls: ['./smart-alert-order.component.css'],
})
export class SmartAlertOrderComponent implements OnInit {
  isLoading = false;

  formData = {
    contact_name: '',
    email: '',
    phone: '',
    company: '',
    address: '',
    employees: '',
    additionalInfo: '',
  };

  constructor(
    private router: Router,
    private odooService: OdooService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {}

  onSubmit(form: NgForm): void {
    if (form.invalid) {
      this.toastr.error('Veuillez remplir tous les champs requis', 'Erreur');
      return;
    }

    this.isLoading = true;

    const descriptionParts = [
      `Commande: Pack Smart Alert`,
      `Prix: 7.500 DHS`,
      `Nom: ${this.formData.contact_name}`,
      `Email: ${this.formData.email}`,
      `Téléphone: ${this.formData.phone}`,
      `Établissement: ${this.formData.company}`,
      `Adresse: ${this.formData.address}`,
      `Nombre d'employés: ${this.formData.employees}`,
      `Informations supplémentaires: ${this.formData.additionalInfo}`,
    ];

    const leadData = {
      name: `Commande Smart Alert - ${this.formData.contact_name}`,
      phone: this.formData.phone,
      email_from: this.formData.email,
      description: descriptionParts.join('\n'),
    };

    this.odooService.createLead(leadData).subscribe({
      next: () => {
        this.toastr.success(
          'Votre commande a été envoyée avec succès',
          'Succès'
        );
        this.router.navigate(['/horeca-smart-alert'], {
          queryParams: { order: 'success' },
        });
        this.isLoading = false;
      },
      error: () => {
        this.toastr.error(
          "Une erreur est survenue lors de l'envoi de la commande",
          'Erreur'
        );
        this.isLoading = false;
      },
    });
  }
}
