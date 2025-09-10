import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { ConsentService } from '../services/consent.service';
import { OdooService } from '../services/odoo.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css',
})
export class ContactComponent {
  isLoading: boolean = false;
  contact_name: string = '';
  phone: string = '';
  email_from: string = '';
  company: string = '';
  subject: string = '';
  description: string = '';
  privacyConsent: boolean = false;
  marketingConsent: boolean = false;

  constructor(
    private odooService: OdooService,
    private toastr: ToastrService,
    private consentService: ConsentService,
    private translate: TranslateService
  ) {}

  onSubmit(form: NgForm): void {
    if (form.invalid) {
      this.toastr.error('Veuillez remplir tous les champs requis', 'Erreur');
      this.consentService.trackFormSubmission('contact_form', false);
      return;
    }

    this.isLoading = true;
    const formValue = form.value;

    // Assemblage de la description complète
    const descriptionParts = [
      `Société: ${formValue.company}`,
      `Sujet: ${formValue.subject}`,
      `Message: ${formValue.description}`,
    ];

    const fullDescription = descriptionParts.join('\n');

    const leadData = {
      name: formValue.contact_name,
      phone: formValue.phone,
      email_from: formValue.email_from,
      description: fullDescription,
    };

    this.odooService.createLead(leadData).subscribe({
      next: (response) => {
        this.toastr.success('Votre message a été envoyé avec succès', 'Succès');
        this.consentService.trackFormSubmission('contact_form', true);
        form.resetForm();
        this.isLoading = false;
      },
      error: (error) => {
        this.toastr.error(
          "Une erreur est survenue lors de l'envoi du message",
          'Erreur'
        );
        this.consentService.trackFormSubmission('contact_form', false);
        this.isLoading = false;
      },
    });
  }
}
