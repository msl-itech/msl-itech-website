import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OdooService } from '../services/odoo.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-soumettre-besoin',
  templateUrl: './soumettre-besoin.component.html',
  styleUrls: ['./soumettre-besoin.component.css']
})
export class SoumettreBesoinComponent implements OnInit {
  jobForm: FormGroup;
  selectedFile: File | null = null;
  isLoading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private odooService: OdooService,
    private toastr: ToastrService
  ) {
    this.jobForm = this.fb.group({
      name: ['', Validators.required],
      email_from: ['', [Validators.required, Validators.email]],
      company: [''],
      subject: ['', Validators.required],
      description: ['', Validators.required]
    });
  }

  ngOnInit(): void {
  }

  onSubmit(): void {
    if (this.jobForm.valid) {
      this.isLoading = true;
      this.toastr.info('Envoi en cours...', 'Patientez');
      
      // Préparer la description complète avec tous les champs additionnels
      const additionalInfo = `
Société: ${this.jobForm.get('company')?.value || 'Non spécifié'}
Sujet: ${this.jobForm.get('subject')?.value}

Description détaillée:
${this.jobForm.get('description')?.value}
`;

      // Créer un objet FormData pour envoyer les données et le fichier
      const formData = new FormData();
      
      // Ajouter les données directement dans le FormData
      formData.append('name', this.jobForm.get('name')?.value);
      formData.append('email_from', this.jobForm.get('email_from')?.value);
      formData.append('phone', 'false');
      formData.append('stage_id', '6');
      formData.append('description', additionalInfo);
      
      // Ajouter le fichier s'il existe
      if (this.selectedFile) {
        formData.append('file', this.selectedFile);
      }

      this.odooService.createLeadWithFile(formData).subscribe({
        next: (response) => {
          this.toastr.clear();
          this.toastr.success('Votre demande a été envoyée avec succès!', 'Succès', {
            timeOut: 3000,
            progressBar: true
          });
          this.jobForm.reset();
          this.selectedFile = null;
          this.isLoading = false;
        },
        error: (error) => {
          this.toastr.clear();
          this.toastr.error('Une erreur est survenue lors de l\'envoi de la demande.', 'Erreur', {
            timeOut: 4000,
            progressBar: true
          });
          console.error('Erreur lors de la création du lead:', error);
          this.isLoading = false;
        }
      });
    } else {
      this.toastr.warning('Veuillez remplir tous les champs obligatoires', 'Attention', {
        timeOut: 3000,
        progressBar: true
      });
    }
  }

  // Simplification des méthodes liées aux fichiers
  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  removeFile(event: Event): void {
    event.stopPropagation();
    this.selectedFile = null;
    // Réinitialiser l'input file
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }
}
