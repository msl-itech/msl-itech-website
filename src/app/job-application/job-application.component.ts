import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OdooService } from '../services/odoo.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-job-application',
  templateUrl: './job-application.component.html',
  styleUrls: ['./job-application.component.css']
})
export class JobApplicationComponent implements OnInit {
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
      phone: ['', Validators.required],
      poste: ['', Validators.required],
      experience: [''],
      disponibilite: [''],
      description: ['', Validators.required]
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.jobForm.valid) {
      this.isLoading = true;
      this.toastr.info('Envoi en cours...', 'Patientez');
      
      // Préparer la description complète
      const additionalInfo = `
Poste souhaité: ${this.jobForm.get('poste')?.value}
Expérience: ${this.jobForm.get('experience')?.value || 'Non spécifiée'}
Disponibilité: ${this.jobForm.get('disponibilite')?.value || 'Non spécifiée'}

Lettre de motivation:
${this.jobForm.get('description')?.value}
`;

      const formData = new FormData();
      
      formData.append('name', this.jobForm.get('name')?.value);
      formData.append('email_from', this.jobForm.get('email_from')?.value);
      formData.append('phone', this.jobForm.get('phone')?.value);
      formData.append('stage_id', '6');
      formData.append('description', additionalInfo);
      
      if (this.selectedFile) {
        formData.append('file', this.selectedFile);
      }

      this.odooService.createLeadWithFile(formData).subscribe({
        next: (response) => {
          this.toastr.clear();
          this.toastr.success('Votre candidature a été envoyée avec succès!', 'Succès', {
            timeOut: 3000,
            progressBar: true
          });
          this.jobForm.reset();
          this.selectedFile = null;
          this.isLoading = false;
        },
        error: (error) => {
          this.toastr.clear();
          this.toastr.error('Une erreur est survenue lors de l\'envoi de la candidature.', 'Erreur', {
            timeOut: 4000,
            progressBar: true
          });
          console.error('Erreur lors de l\'envoi:', error);
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

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  removeFile(event: Event): void {
    event.stopPropagation();
    this.selectedFile = null;
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }
} 