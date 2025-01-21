import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-soumettre-besoin',
  templateUrl: './soumettre-besoin.component.html',
  styleUrl: './soumettre-besoin.component.css'
})
export class SoumettreBesoinComponent {
  jobForm!: FormGroup;
  selectedFiles: File[] = [];

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.jobForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      company: [''],
      subject: ['', Validators.required],
      date: [''],
      description: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.jobForm.valid) {
      console.log('Form Data:', this.jobForm.value);
      console.log('Files:', this.selectedFiles);
      // Ex: Envoi vers votre backend...
    }
  }

  // Gestion du clic "Sélectionner un fichier"
  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files) return;
    Array.from(input.files).forEach((file) => {
      this.selectedFiles.push(file);
    });
    // Réinitialiser l'input pour pouvoir re-sélectionner le même fichier si besoin
    input.value = '';
  }

  // DRAG & DROP : Survol
  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    const dropZone = document.querySelector('.file-upload');
    dropZone?.classList.add('highlight');
  }

  // DRAG & DROP : Sortie du survol
  onDragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    const dropZone = document.querySelector('.file-upload');
    dropZone?.classList.remove('highlight');
  }

  // DRAG & DROP : Dépôt
  onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    const dropZone = document.querySelector('.file-upload');
    dropZone?.classList.remove('highlight');

    if (event.dataTransfer?.files.length) {
      Array.from(event.dataTransfer.files).forEach(file => {
        this.selectedFiles.push(file);
      });
    }
  }

  // Supprimer un fichier de la liste
  removeFile(index: number) {
    this.selectedFiles.splice(index, 1);
  }
}
