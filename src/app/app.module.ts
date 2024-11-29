import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { AccueilComponent } from './accueil/accueil.component';
import { SliderComponent } from './slider/slider.component';
import { FeatureComponent } from './feature/feature.component';
import { PackageMetierComponent } from './package-metier/package-metier.component';
import { BlogComponent } from './blog/blog.component';
import { CertificationComponent } from './certification/certification.component';
import { FooterComponent } from './footer/footer.component';
import { Service1Component } from './service1/service1.component';
import { PagePackageComponent } from './page-package/page-package.component';
import { Service2Component } from './service2/service2.component';
import { AvantagesOdooComponent } from './avantages-odoo/avantages-odoo.component';
import { AboutComponent } from './about/about.component';
import { JobComponent } from './job/job.component';
import { Service3Component } from './service3/service3.component';
import { Service4Component } from './service4/service4.component';
import { ReserveDemoComponent } from './reserve-demo/reserve-demo.component';
import { TextSlideComponent } from './text-slide/text-slide.component';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCertificate, faCogs, faGlobe, faHeadset, faMoneyBillWave } from '@fortawesome/free-solid-svg-icons';
import { AvantagesComponent } from './avantages/avantages.component';
import { ContactComponent } from './contact/contact.component';
import { SoumettreBesoinComponent } from './soumettre-besoin/soumettre-besoin.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { TarifsComponent } from './tarifs/tarifs.component';
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
    TarifsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FontAwesomeModule,
    NgxSpinnerModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(library: FaIconLibrary) {
    // Ajouter les icônes à la bibliothèque
    library.addIcons(faCertificate, faCogs, faGlobe, faMoneyBillWave, faHeadset);
  }
 }
