import { Component, ElementRef, ViewChild } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css'
})
export class ContactComponent {
  isLoading: boolean = true; // Indicateur de chargement
  constructor(private spinner: NgxSpinnerService) {}
  @ViewChild('odooIframe', { static: false }) iframe!: ElementRef; // Référence à l'iframe
  ngOnInit(): void {
    this.spinner.show();

    setTimeout(() => {
      /** spinner ends after 5 seconds */
      this.spinner.hide();
    }, 3000);
  }
  ngAfterViewInit() {
    // Écouter l'événement onload de l'iframe
    this.iframe.nativeElement.onload = () => {
      this.isLoading = false; // Cacher le loader une fois l'iframe chargé
    };
  }
}
