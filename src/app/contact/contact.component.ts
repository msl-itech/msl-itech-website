import { Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css'
})
export class ContactComponent {
  isLoading: boolean = true; // Indicateur de chargement

  @ViewChild('odooIframe', { static: false }) iframe!: ElementRef; // Référence à l'iframe

  ngAfterViewInit() {
    // Écouter l'événement onload de l'iframe
    this.iframe.nativeElement.onload = () => {
      this.isLoading = false; // Cacher le loader une fois l'iframe chargé
    };
  }
}
