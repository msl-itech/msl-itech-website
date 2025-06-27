import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { HttpClient, HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  FaIconLibrary,
  FontAwesomeModule,
} from '@fortawesome/angular-fontawesome';
import {
  faCertificate,
  faCogs,
  faGlobe,
  faHeadset,
  faMoneyBillWave,
} from '@fortawesome/free-solid-svg-icons';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ToastrModule } from 'ngx-toastr';

// Imports pour ngx-translate
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { AboutComponent } from './about/about.component';
import { AccueilComponent } from './accueil/accueil.component';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AvantagesOdooComponent } from './avantages-odoo/avantages-odoo.component';
import { AvantagesComponent } from './avantages/avantages.component';
import { BlogComponent } from './blog/blog.component';
import { CertificationComponent } from './certification/certification.component';
import { CodePromoComponent } from './code-promo/code-promo.component';
import { ContactComponent } from './contact/contact.component';
import { CountUpDirective } from './count-up.directive';
import { DemoReservationComponent } from './demo-reservation/demo-reservation.component';
import { FeatureComponent } from './feature/feature.component';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import { HorecaFormulesComponent } from './horeca-formules/horeca-formules.component';
import { HorecaServiceExclusifComponent } from './horeca-service-exclusif/horeca-service-exclusif.component';
import { HorecaSmartAlertComponent } from './horeca-smart-alert/horeca-smart-alert.component';
import { JobApplicationComponent } from './job-application/job-application.component';
import { JobComponent } from './job/job.component';
import { LanguageSelectorComponent } from './language-selector/language-selector.component';
import { OptionFormComponent } from './option-form/option-form.component';
import { PackAdministratifComponent } from './pack-administratif/pack-administratif.component';
import { PackHorecaComponent } from './pack-horeca/pack-horeca.component';
import { PackPerformanceComponent } from './pack-performance/pack-performance.component';
import { PackSelectionComponent } from './pack-selection/pack-selection.component';
import { PackageMetierAccueilComponent } from './package-metier-accueil/package-metier-accueil.component';
import { PackageMetierComponent } from './package-metier/package-metier.component';
import { PagePackageComponent } from './page-package/page-package.component';
import { PrendreRendezVousComponent } from './prendre-rendez-vous/prendre-rendez-vous.component';
import { PricingOdooComponent } from './pricing-odoo/pricing-odoo.component';
import { ReservationHorecaComponent } from './reservation-horeca/reservation-horeca.component';
import { ReserveDemoComponent } from './reserve-demo/reserve-demo.component';
import { Service1Component } from './service1/service1.component';
import { Service2Component } from './service2/service2.component';
import { Service3Component } from './service3/service3.component';
import { Service4Component } from './service4/service4.component';
import { Service5Component } from './service5/service5.component';
import { Service6Component } from './service6/service6.component';
import { Service7Component } from './service7/service7.component';
import { SliderComponent } from './slider/slider.component';
import { SmartAlertOrderComponent } from './smart-alert-order/smart-alert-order.component';
import { SoumettreBesoinComponent } from './soumettre-besoin/soumettre-besoin.component';
import { SupportComponent } from './support/support.component';
import { TableauCRMVENTEComponent } from './tableau-crm-vente/tableau-crm-vente.component';
import { TarifOdooComponent } from './tarif-odoo/tarif-odoo.component';
import { TarifsComponent } from './tarifs/tarifs.component';
import { TextSlideComponent } from './text-slide/text-slide.component';
import { TimelineHorecaComponent } from './timeline-horeca/timeline-horeca.component';

// Factory function pour le loader de traduction
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    AccueilComponent,
    SliderComponent,
    FeatureComponent,
    PackageMetierComponent,
    BlogComponent,
    CertificationComponent,
    FooterComponent,
    Service1Component,
    PagePackageComponent,
    Service2Component,
    AvantagesOdooComponent,
    AboutComponent,
    JobComponent,
    Service3Component,
    Service4Component,
    ReserveDemoComponent,
    TextSlideComponent,
    AvantagesComponent,
    ContactComponent,
    SoumettreBesoinComponent,
    TarifsComponent,
    PricingOdooComponent,
    CountUpDirective,
    PackPerformanceComponent,
    TableauCRMVENTEComponent,
    CodePromoComponent,
    PackAdministratifComponent,
    PackHorecaComponent,
    TimelineHorecaComponent,
    TarifOdooComponent,
    PackageMetierAccueilComponent,
    HorecaFormulesComponent,
    HorecaSmartAlertComponent,
    HorecaServiceExclusifComponent,
    JobApplicationComponent,
    DemoReservationComponent,
    PackSelectionComponent,
    ReservationHorecaComponent,
    Service5Component,
    Service6Component,
    Service7Component,
    SupportComponent,
    OptionFormComponent,
    SmartAlertOrderComponent,
    PrendreRendezVousComponent,
    LanguageSelectorComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FontAwesomeModule,
    NgxSpinnerModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    // Configuration de TranslateModule
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
    ToastrModule.forRoot({
      positionClass: 'toast-top-right',
      preventDuplicates: true,
      timeOut: 3000,
    }),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor(library: FaIconLibrary) {
    // Ajouter les icônes à la bibliothèque
    library.addIcons(
      faCertificate,
      faCogs,
      faGlobe,
      faMoneyBillWave,
      faHeadset
    );
  }
}
