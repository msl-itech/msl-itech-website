import { Component } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-soumettre-besoin',
  templateUrl: './soumettre-besoin.component.html',
  styleUrl: './soumettre-besoin.component.css'
})
export class SoumettreBesoinComponent {
  constructor(private spinner: NgxSpinnerService) {}
  ngOnInit(): void {
    this.spinner.show();

    setTimeout(() => {
      /** spinner ends after 5 seconds */
      this.spinner.hide();
    }, 3000);
  }
}
