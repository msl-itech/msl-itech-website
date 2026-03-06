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
import { PolitiqueConfidentialiteComponent } from './politique-confidentialite/politique-confidentialite.component';
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
import { DevenirPartenaireComponent } from './devenir-partenaire/devenir-partenaire.component';
import { QuestionnaireComponent } from './questionnaire/questionnaire.component';
import { OrderWebsiteComponent } from './order-website/order-website.component';
import { ReferencesComponent } from './references/references.component';
const routes: Routes = [
  { path: '', redirectTo: 'accueil', pathMatch: 'full' },
  { path: 'sitemap', redirectTo: '/sitemap.xml', pathMatch: 'full' },
  { path: 'accueil', component: AccueilComponent, title: 'Accueil - MSL iTech | Conseil Odoo & IT' },
  { path: 'blog', component: BlogPageComponent, title: 'Blog MSL iTech - Actualités & Solutions Odoo' },
  { path: 'blog/:slug', component: BlogDetailComponent, title: 'Article MSL iTech' },
  { path: 'package-metier', component: PagePackageComponent, title: 'Nos Packages Métiers Odoo | MSL iTech' },
  { path: 'serviceOdoo', component: Service1Component, title: 'Services Odoo - Déploiement & Support | MSL iTech' },
  { path: 'finances', component: Service2Component, title: 'Gestion Financière Odoo | MSL iTech' },
  { path: 'ventes', component: Service3Component, title: 'Gestion des Ventes & CRM Odoo | MSL iTech' },
  { path: 'fabrication', component: Service4Component, title: 'Gestion de Production (MRP) Odoo | MSL iTech' },
  { path: 'ressources-humaines', component: Service5Component, title: 'Gestion des Ressources Humaines Odoo | MSL iTech' },
  { path: 'marketing-digital', component: Service6Component, title: 'Marketing Digital intégré à Odoo | MSL iTech' },
  { path: 'services-professionnels', component: Service7Component, title: 'Services Professionnels Odoo | MSL iTech' },
  { path: 'about', component: AboutComponent, title: 'À propos de MSL iTech - Notre Mission' },
  { path: 'job', component: JobComponent, title: 'Recrutement MSL iTech - Rejoignez-nous' },
  { path: 'contact', component: ContactComponent, title: 'Contactez MSL iTech - Echangeons Formellement' },
  { path: 'besoin', component: SoumettreBesoinComponent, title: 'Soumettre un Besoin - MSL iTech' },
  { path: 'tarif', component: TarifsComponent, title: 'Tarifs MSL iTech - Nos abonnements' },
  { path: 'tarif-Odoo', component: TarifOdooComponent, title: 'Tarifs d\'intégration Odoo | MSL iTech' },
  { path: 'pricing', component: PricingOdooComponent, title: 'Pricing Odoo | MSL iTech' },
  {
    path: 'politique-confidentialite',
    component: PolitiqueConfidentialiteComponent,
    title: 'Politique de Confidentialité | MSL iTech'
  },
  { path: 'package-metier/commerciale', component: PackPerformanceComponent, title: 'Package Performance Commerciale Odoo' },
  { path: 'package-metier/horeca', component: PackHorecaComponent, title: 'Package HORECA & Odoo | MSL iTech' },
  {
    path: 'package-metier/horeca/formules',
    component: HorecaFormulesComponent,
    title: 'HORECA - Nos Formules Odoo'
  },
  {
    path: 'package-metier/horeca/smartAlert',
    component: HorecaSmartAlertComponent,
    title: 'HORECA - Odoo Smart Alert'
  },
  {
    path: 'package-metier/horeca/services-exclusifs',
    component: HorecaServiceExclusifComponent,
    title: 'HORECA - Services Exclusifs Odoo'
  },
  {
    path: 'package-metier/administratif',
    component: PackAdministratifComponent,
    title: 'Package Gestion Administrative Odoo'
  },
  { path: 'prendre-rendez-vous', component: PrendreRendezVousComponent, title: 'Prendre Rendez-vous - MSL iTech' },
  { path: 'careers', component: JobApplicationComponent, title: 'Carrières MSL iTech - Rejoignez-nous' },
  { path: 'reserver-demo', component: DemoReservationComponent, title: 'Réserver une Démo Odoo - MSL iTech' },
  { path: 'pack-selection', component: PackSelectionComponent, title: 'Sélectionnez votre Pack Odoo' },
  { path: 'reservation-horeca', component: ReservationHorecaComponent, title: 'Réservation Pack HORECA' },
  { path: 'support', component: SupportComponent, title: 'Support & Assistance Technique MSL iTech' },
  { path: 'option-form', component: OptionFormComponent, title: 'Options Supplémentaires Odoo' },
  { path: 'smart-alert-order', component: SmartAlertOrderComponent, title: 'Commande Smart Alert' },
  { path: 'devenir-partenaire', component: DevenirPartenaireComponent, title: 'Devenir Partenaire MSL iTech' },
  { path: 'questionnaire', component: QuestionnaireComponent, title: 'Évaluez vos besoins IT / Odoo | Questionnaire' },
  { path: 'order-website', component: OrderWebsiteComponent, title: 'Commander votre Site Web' },
  { path: 'references', component: ReferencesComponent, title: 'Nos Références Clients | MSL iTech' },
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
export class AppRoutingModule { }
