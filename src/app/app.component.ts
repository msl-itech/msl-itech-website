import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import AOS from 'aos';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'MSL-Website';

  constructor(
    private spinner: NgxSpinnerService,
    private translate: TranslateService
  ) {
    // La configuration de la langue est maintenant gérée dans APP_INITIALIZER
    // pour éviter le flash de contenu non traduit au chargement
  }

  ngOnInit() {
    /** spinner starts on init */
    this.spinner.show();
    AOS.init({
      duration: 1000, // Durée de l'animation en millisecondes
      easing: 'ease-in-out', // Type d'animation
      once: true, // Si true, l'animation ne se répète qu'une seule fois
      mirror: false, // Si true, les éléments sont animés lors du défilement vers le haut
    });
    setTimeout(() => {
      /** spinner ends after 5 seconds */
      this.spinner.hide();
    }, 1500);
  }
}
