import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutComponent } from './about/about.component';
import { AccueilComponent } from './accueil/accueil.component';
import { BlogDetailComponent } from './blog-detail/blog-detail.component';
import { BlogPageComponent } from './blog-page/blog-page.component';
import { ContactComponent } from './contact/contact.component';
import { DemoReservationComponent } from './demo-reservation/demo-reservation.component';
import { HorecaFormulesComponent } from './horeca-formules/horeca-formules.component';
import { HorecaServiceExclusifComponent } from './horeca-service-exclusif/horeca-service-exclusif.component';
import { HorecaSmartAlertComponent } from './horeca-smart-alert/horeca-smart-alert.component';
import { JobApplicationComponent } from './job-application/job-application.component';
import { JobComponent } from './job/job.component';
import { OptionFormComponent } from './option-form/option-form.component';
import { PackAdministratifComponent } from './pack-administratif/pack-administratif.component';
import { PackHorecaComponent } from './pack-horeca/pack-horeca.component';
import { PackPerformanceComponent } from './pack-performance/pack-performance.component';
import { PackSelectionComponent } from './pack-selection/pack-selection.component';
import { PagePackageComponent } from './page-package/page-package.component';
import { PrendreRendezVousComponent } from './prendre-rendez-vous/prendre-rendez-vous.component';
import { PricingOdooComponent } from './pricing-odoo/pricing-odoo.component';
import { ReservationHorecaComponent } from './reservation-horeca/reservation-horeca.component';
import { Service1Component } from './service1/service1.component';
import { Service2Component } from './service2/service2.component';
import { Service3Component } from './service3/service3.component';
import { Service4Component } from './service4/service4.component';
import { Service5Component } from './service5/service5.component';
import { Service6Component } from './service6/service6.component';
import { Service7Component } from './service7/service7.component';
import { SmartAlertOrderComponent } from './smart-alert-order/smart-alert-order.component';
import { SoumettreBesoinComponent } from './soumettre-besoin/soumettre-besoin.component';
import { SupportComponent } from './support/support.component';
import { TarifOdooComponent } from './tarif-odoo/tarif-odoo.component';
import { TarifsComponent } from './tarifs/tarifs.component';
const routes: Routes = [
  { path: '', redirectTo: 'accueil', pathMatch: 'full' },
  { path: 'sitemap', redirectTo: '/sitemap.xml', pathMatch: 'full' },
  { path: 'accueil', component: AccueilComponent },
  { path: 'blog', component: BlogPageComponent },
  { path: 'blog/:slug', component: BlogDetailComponent },
  { path: 'package-metier', component: PagePackageComponent },
  { path: 'serviceOdoo', component: Service1Component },
  { path: 'service2', component: Service2Component },
  { path: 'service3', component: Service3Component },
  { path: 'fabrication', component: Service4Component },
  { path: 'ressources-humaines', component: Service5Component },
  { path: 'marketing-digital', component: Service6Component },
  { path: 'services-professionnels', component: Service7Component },
  { path: 'about', component: AboutComponent },
  { path: 'job', component: JobComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'besoin', component: SoumettreBesoinComponent },
  { path: 'tarif', component: TarifsComponent },
  { path: 'tarif-Odoo', component: TarifOdooComponent },
  { path: 'pricing', component: PricingOdooComponent },
  { path: 'package-metier/commerciale', component: PackPerformanceComponent },
  { path: 'package-metier/horeca', component: PackHorecaComponent },
  {
    path: 'package-metier/horeca/formules',
    component: HorecaFormulesComponent,
  },
  {
    path: 'package-metier/horeca/smartAlert',
    component: HorecaSmartAlertComponent,
  },
  {
    path: 'package-metier/horeca/services-exclusifs',
    component: HorecaServiceExclusifComponent,
  },
  {
    path: 'package-metier/administratif',
    component: PackAdministratifComponent,
  },
  { path: 'prendre-rendez-vous', component: PrendreRendezVousComponent },
  { path: 'careers', component: JobApplicationComponent },
  { path: 'reserver-demo', component: DemoReservationComponent },
  { path: 'pack-selection', component: PackSelectionComponent },
  { path: 'reservation-horeca', component: ReservationHorecaComponent },
  { path: 'support', component: SupportComponent },
  { path: 'option-form', component: OptionFormComponent },
  { path: 'smart-alert-order', component: SmartAlertOrderComponent },
  { path: '**', redirectTo: 'accueil', pathMatch: 'full' },
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      scrollPositionRestoration: 'enabled',
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
