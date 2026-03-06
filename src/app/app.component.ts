import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'MSL-Website';

  constructor(
    private spinner: NgxSpinnerService,
    private translate: TranslateService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    // La configuration de la langue est maintenant gérée dans APP_INITIALIZER
    // pour éviter le flash de contenu non traduit au chargement
  }

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      /** spinner starts on init */
      this.spinner.show();

      // AOS utilise window/document - browser uniquement
      import('aos').then((AOS) => {
        AOS.default.init({
          duration: 1000,
          easing: 'ease-in-out',
          once: true,
          mirror: false,
        });
      });

      setTimeout(() => {
        /** spinner ends after 1.5 seconds */
        this.spinner.hide();
      }, 1500);
    }
  }
}
