import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css'
})
export class ContactComponent {
  isLoading: boolean = true; // Indicateur de chargement
  constructor(private spinner: NgxSpinnerService) {}
  ngOnInit(): void {
    this.spinner.show();
    this.adjustHeight();  
    setTimeout(() => {
      /** spinner ends after 5 seconds */
      this.spinner.hide();
    }, 1000);
  }
 
  @HostListener('window:resize')
  adjustHeight() {
    const iframeContainer = document.getElementById('iframeContainer');
    if (iframeContainer) {
      iframeContainer.style.height = `${window.innerHeight}px`;
    }
  }
}
