import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { OdooService } from '../services/odoo.service';

@Component({
    selector: 'app-order-website',
    templateUrl: './order-website.component.html',
    styleUrls: ['./order-website.component.css'],
})
export class OrderWebsiteComponent implements OnInit {
    isLoading = false;
    currentStep = 1;
    totalSteps = 9;
    minDate = new Date().toISOString().split('T')[0]; // Today's date in YYYY-MM-DD format

    formData = {
        // 1. Informations générales
        companyName: '',
        contactName: '',
        email: '',
        phone: '',
        sector: '',

        // 2. Objectifs du site
        siteGoal: '',
        expectedResults: '',
        targetAudience: '',
        visitorNeeds: '',

        // 3. Type de site
        siteType: '',

        // 4. Pages souhaitées
        pages: {
            home: false,
            about: false,
            services: false,
            blog: false,
            contact: false,
            other: ''
        },

        // 5. Fonctionnalités
        features: {
            contactForm: false,
            booking: false,
            payment: false,
            memberArea: false,
            chat: false,
            newsletter: false
        },

        // 6. Contenu fourni
        contentProvided: {
            text: false,
            images: false,
            logo: false,
            video: false
        },

        // 7. Design & Identité
        designStyle: '',
        hasBranding: null,
        likedSites: '',
        seoNeeded: false,

        // 8. Aspects Techniques & Budget
        domainExists: null,
        hostingExists: null,
        budget: '',
        deadline: '',

        // 9. Support & Formation
        maintenanceNeeded: false,
        monthlySupport: false
    };

    steps = [
        { title: 'Informations Générales', icon: 'fa-building' },
        { title: 'Objectifs du Site', icon: 'fa-bullseye' },
        { title: 'Type de Site', icon: 'fa-globe' },
        { title: 'Pages Souhaitées', icon: 'fa-sitemap' },
        { title: 'Fonctionnalités', icon: 'fa-cogs' },
        { title: 'Contenus Fournis', icon: 'fa-folder-open' },
        { title: 'Design & Identité', icon: 'fa-paint-brush' },
        { title: 'Technique & Budget', icon: 'fa-flag-checkered' },
        { title: 'Support & Formation', icon: 'fa-headset' }
    ];

    constructor(
        private router: Router,
        private odooService: OdooService,
        private toastr: ToastrService
    ) { }

    ngOnInit(): void { }

    nextStep(form: NgForm): void {
        // Basic validation for required fields in each step can be added here
        if (this.currentStep < this.totalSteps) {
            this.currentStep++;
            window.scrollTo(0, 0);
        }
    }

    prevStep(): void {
        if (this.currentStep > 1) {
            this.currentStep--;
            window.scrollTo(0, 0);
        }
    }

    goToStep(step: number): void {
        if (step < this.currentStep) {
            this.currentStep = step;
        }
    }

    onSubmit(form: NgForm): void {
        if (form.invalid) {
            this.toastr.error('Veuillez remplir tous les champs obligatoires.', 'Erreur');
            return;
        }

        this.isLoading = true;

        // Formatting the description for Odoo
        const descriptionParts = [
            `=== COMMANDE SITE WEB ===`,

            `\n--- 1. INFORMATIONS GÉNÉRALES ---`,
            `Entreprise: ${this.formData.companyName}`,
            `Contact: ${this.formData.contactName}`,
            `Email: ${this.formData.email}`,
            `Téléphone: ${this.formData.phone}`,
            `Secteur d'activité: ${this.formData.sector}`,

            `\n--- 2. OBJECTIFS DU SITE ---`,
            `Objectif principal: ${this.formData.siteGoal}`,
            `Résultats attendus: ${this.formData.expectedResults}`,
            `Public cible: ${this.formData.targetAudience}`,
            `Besoins des visiteurs: ${this.formData.visitorNeeds}`,

            `\n--- 3. TYPE DE SITE & STRUCTURE ---`,
            `Type de site: ${this.formData.siteType}`,
            `Pages souhaitées: ${this.getSelectedOptions(this.formData.pages)}`,

            `\n--- 4. FONCTIONNALITÉS & CONTENU ---`,
            `Fonctionnalités: ${this.getSelectedOptions(this.formData.features)}`,
            `Contenus fournis: ${this.getSelectedOptions(this.formData.contentProvided)}`,

            `\n--- 5. DESIGN & IDENTITÉ ---`,
            `Charte graphique existante: ${this.formData.hasBranding === true ? 'Oui' : this.formData.hasBranding === false ? 'Non' : 'Non spécifié'}`,
            `Style souhaité: ${this.formData.designStyle}`,
            `Sites de référence: ${this.formData.likedSites}`,
            `Référencement SEO: ${this.formData.seoNeeded ? 'Oui' : 'Non'}`,

            `\n--- 6. ASPECTS TECHNIQUES & BUDGET ---`,
            `Nom de domaine existant: ${this.formData.domainExists === true ? 'Oui' : this.formData.domainExists === false ? 'À créer' : 'Non spécifié'}`,
            `Hébergement existant: ${this.formData.hostingExists === true ? 'Oui' : this.formData.hostingExists === false ? 'À fournir' : 'Non spécifié'}`,
            `Budget estimé: ${this.formData.budget}`,
            `Date de livraison souhaitée: ${this.formData.deadline}`,

            `\n--- 7. SUPPORT & FORMATION ---`,
            `Formation demandée: ${this.formData.maintenanceNeeded ? 'Oui' : 'Non'}`,
            `Support mensuel: ${this.formData.monthlySupport ? 'Oui' : 'Non'}`,
        ];

        const leadData = {
            name: `Projet Web - ${this.formData.companyName} (${this.formData.contactName})`,
            phone: this.formData.phone,
            email_from: this.formData.email,
            contact_name: this.formData.contactName,
            description: descriptionParts.join('\n'),
        };

        this.odooService.createLead(leadData).subscribe({
            next: () => {
                this.toastr.success(
                    'Votre projet a été transmis avec succès. Un expert vous contactera sous peu.',
                    'Demande envoyée'
                );
                this.router.navigate(['/']);
                this.isLoading = false;
            },
            error: (err) => {
                console.error('Odoo error', err);
                this.toastr.error(
                    "Une erreur est survenue lors de l'envoi de votre demande. Veuillez réessayer ou nous contacter directement.",
                    'Oups !'
                );
                this.isLoading = false;
            },
        });
    }

    private getSelectedOptions(obj: any): string {
        return Object.keys(obj)
            .filter(key => key !== 'other' && obj[key])
            .map(key => key)
            .join(', ') + (obj.other ? `, Autre: ${obj.other}` : '');
    }
}
