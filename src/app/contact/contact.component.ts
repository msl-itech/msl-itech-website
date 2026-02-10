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
  ) { }

  onSubmit(form: NgForm): void {
    if (form.invalid) {
      this.toastr.error('Veuillez remplir tous les champs requis', 'Erreur');
      this.consentService.trackFormSubmission('contact_form', false);
      return;
    }

    this.isLoading = true;
    const formValue = form.value;

    // Assemblage de la description complète avec HTML
    const descriptionParts = [
      `<h3>📬 Nouvelle demande de contact</h3>`,

      // Section Contact
      `<div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #114d5a;">`,
      `<h4 style="color: #114d5a; margin-top: 0;">🏢 Informations de contact</h4>`,
      `<table style="width: 100%; border-collapse: collapse;">`,
      `<tr><td style="padding: 5px 10px; color: #6c757d;">Nom:</td><td style="padding: 5px 10px;"><strong>${formValue.contact_name}</strong></td></tr>`,
      `<tr><td style="padding: 5px 10px; color: #6c757d;">Société:</td><td style="padding: 5px 10px;"><strong>${formValue.company}</strong></td></tr>`,
      `<tr><td style="padding: 5px 10px; color: #6c757d;">Email:</td><td style="padding: 5px 10px;"><a href="mailto:${formValue.email_from}">${formValue.email_from}</a></td></tr>`,
      `<tr><td style="padding: 5px 10px; color: #6c757d;">Téléphone:</td><td style="padding: 5px 10px;"><a href="tel:${formValue.phone}">${formValue.phone}</a></td></tr>`,
      `</table>`,
      `</div>`,

      // Section Sujet
      `<div style="background: #fff3cd; padding: 15px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #ffc107;">`,
      `<h4 style="color: #856404; margin-top: 0;">📋 Sujet de la demande</h4>`,
      `<p style="margin: 0; font-size: 16px;"><strong>${formValue.subject || 'Non spécifié'}</strong></p>`,
      `</div>`,

      // Section Message
      `<div style="background: #e7f5ff; padding: 15px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #0d6efd;">`,
      `<h4 style="color: #0d6efd; margin-top: 0;">💬 Message</h4>`,
      `<p style="margin: 0; white-space: pre-wrap; line-height: 1.6;">${formValue.description || 'Aucun message'}</p>`,
      `</div>`,

      `<hr style="margin: 20px 0; border: none; border-top: 1px solid #ddd;">`,
      `<p style="color: #6c757d; font-size: 12px; text-align: center;">`,
      `<em>📅 Demande reçue le ${new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</em>`,
      `</p>`
    ];

    const fullDescription = descriptionParts.join('');

    const leadData = {
      name: `📬 Contact - ${formValue.contact_name} (${formValue.company})`,
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
