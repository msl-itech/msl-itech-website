import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { OdooService } from '../services/odoo.service';

@Component({
  selector: 'app-option-form',
  templateUrl: './option-form.component.html',
  styleUrls: ['./option-form.component.css'],
})
export class OptionFormComponent implements OnInit {
  isLoading = false;
  optionName = '';
  optionPrice = '';
  optionCode = '';

  formData = {
    contact_name: '',
    email: '',
    phone: '',
    company: '',
    additionalInfo: '',
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private odooService: OdooService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    // Récupérer les paramètres de l'URL
    this.route.queryParams.subscribe((params) => {
      this.optionCode = params['option'] || '';
      this.optionPrice = params['price'] || '';

      // Définir le nom de l'option en fonction du code
      switch (this.optionCode) {
        case 'gestion-equipes':
          this.optionName = 'Gestion des équipes';
          break;
        case 'menu-digital':
          this.optionName = 'Menu digital avec QR Code';
          break;
        case 'gestion-evenements':
          this.optionName = 'Gestion des événements privés';
          break;
        default:
          // Rediriger vers la page des formules si aucune option n'est spécifiée
          this.router.navigate(['/horeca-formules']);
      }
    });
  }

  async onSubmit(form: NgForm): Promise<void> {
    if (form.invalid) {
      this.toastr.error('Veuillez remplir tous les champs requis', 'Erreur');
      return;
    }

    this.isLoading = true;

    const descriptionParts = [
      `Option commandée: ${this.optionName}`,
      `Prix: ${this.optionPrice} MAD/mois`,
      `Nom: ${this.formData.contact_name}`,
      `Email: ${this.formData.email}`,
      `Téléphone: ${this.formData.phone}`,
      `Entreprise: ${this.formData.company}`,
      `Informations supplémentaires: ${this.formData.additionalInfo}`,
    ];

    const leadData = {
      name: `Commande ${this.optionName} - ${this.formData.contact_name}`,
      phone: this.formData.phone,
      email_from: this.formData.email,
      description: descriptionParts.join('\n')
    };

    this.odooService.createLead(leadData).subscribe({
      next: () => {
        this.toastr.success(
          'Votre commande a été envoyée avec succès',
          'Succès'
        );
        this.router.navigate(['/horeca-formules']);
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
