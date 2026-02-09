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

        // Formatting the description for Odoo with HTML
        const descriptionParts = [
            `<h3>🌐 Commande Site Web - ${this.formData.companyName}</h3>`,

            // Section 1: Informations générales
            `<div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #114d5a;">`,
            `<h4 style="color: #114d5a; margin-top: 0;">🏢 1. Informations Générales</h4>`,
            `<table style="width: 100%; border-collapse: collapse;">`,
            `<tr><td style="padding: 5px 10px; color: #6c757d;">Entreprise:</td><td style="padding: 5px 10px;"><strong>${this.formData.companyName}</strong></td></tr>`,
            `<tr><td style="padding: 5px 10px; color: #6c757d;">Contact:</td><td style="padding: 5px 10px;"><strong>${this.formData.contactName}</strong></td></tr>`,
            `<tr><td style="padding: 5px 10px; color: #6c757d;">Email:</td><td style="padding: 5px 10px;"><a href="mailto:${this.formData.email}">${this.formData.email}</a></td></tr>`,
            `<tr><td style="padding: 5px 10px; color: #6c757d;">Téléphone:</td><td style="padding: 5px 10px;"><a href="tel:${this.formData.phone}">${this.formData.phone}</a></td></tr>`,
            `<tr><td style="padding: 5px 10px; color: #6c757d;">Secteur:</td><td style="padding: 5px 10px;">${this.formData.sector}</td></tr>`,
            `</table>`,
            `</div>`,

            // Section 2: Objectifs du site
            `<div style="background: #fff3cd; padding: 15px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #ffc107;">`,
            `<h4 style="color: #856404; margin-top: 0;">🎯 2. Objectifs du Site</h4>`,
            `<ul style="margin: 0; padding-left: 20px;">`,
            `<li><strong>Objectif principal:</strong> ${this.formData.siteGoal}</li>`,
            `<li><strong>Résultats attendus:</strong> ${this.formData.expectedResults}</li>`,
            `<li><strong>Public cible:</strong> ${this.formData.targetAudience}</li>`,
            `<li><strong>Besoins des visiteurs:</strong> ${this.formData.visitorNeeds}</li>`,
            `</ul>`,
            `</div>`,

            // Section 3 & 4: Type de site et pages
            `<div style="background: #e7f5ff; padding: 15px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #0d6efd;">`,
            `<h4 style="color: #0d6efd; margin-top: 0;">🌍 3. Type de Site & Structure</h4>`,
            `<p style="margin: 5px 0;"><strong>Type de site:</strong> <span style="background: #0d6efd; color: white; padding: 3px 10px; border-radius: 12px; font-size: 12px;">${this.formData.siteType}</span></p>`,
            `<p style="margin: 10px 0 5px;"><strong>Pages souhaitées:</strong></p>`,
            `<p style="margin: 0;">${this.getSelectedOptionsAsBadges(this.formData.pages)}</p>`,
            `</div>`,

            // Section 5: Fonctionnalités
            `<div style="background: #d4edda; padding: 15px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #28a745;">`,
            `<h4 style="color: #28a745; margin-top: 0;">⚙️ 4. Fonctionnalités & Contenu</h4>`,
            `<p style="margin: 5px 0;"><strong>Fonctionnalités:</strong></p>`,
            `<p style="margin: 0 0 10px;">${this.getSelectedOptionsAsBadges(this.formData.features, '#28a745')}</p>`,
            `<p style="margin: 10px 0 5px;"><strong>Contenus fournis:</strong></p>`,
            `<p style="margin: 0;">${this.getSelectedOptionsAsBadges(this.formData.contentProvided, '#17a2b8')}</p>`,
            `</div>`,

            // Section 6: Design & Identité
            `<div style="background: #f8d7da; padding: 15px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #dc3545;">`,
            `<h4 style="color: #dc3545; margin-top: 0;">🎨 5. Design & Identité</h4>`,
            `<table style="width: 100%; border-collapse: collapse;">`,
            `<tr><td style="padding: 5px 10px; color: #6c757d;">Charte graphique:</td><td style="padding: 5px 10px;">${this.formData.hasBranding === true ? '✅ Oui' : this.formData.hasBranding === false ? '❌ Non' : '⚪ Non spécifié'}</td></tr>`,
            `<tr><td style="padding: 5px 10px; color: #6c757d;">Style souhaité:</td><td style="padding: 5px 10px;"><strong>${this.formData.designStyle}</strong></td></tr>`,
            `<tr><td style="padding: 5px 10px; color: #6c757d;">Sites de référence:</td><td style="padding: 5px 10px;">${this.formData.likedSites || 'Non spécifié'}</td></tr>`,
            `<tr><td style="padding: 5px 10px; color: #6c757d;">SEO:</td><td style="padding: 5px 10px;">${this.formData.seoNeeded ? '✅ Oui' : '❌ Non'}</td></tr>`,
            `</table>`,
            `</div>`,

            // Section 7: Aspects Techniques & Budget
            `<div style="background: #e2e3e5; padding: 15px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #6c757d;">`,
            `<h4 style="color: #495057; margin-top: 0;">💻 6. Aspects Techniques & Budget</h4>`,
            `<table style="width: 100%; border-collapse: collapse;">`,
            `<tr><td style="padding: 5px 10px; color: #6c757d;">Nom de domaine:</td><td style="padding: 5px 10px;">${this.formData.domainExists === true ? '✅ Existant' : this.formData.domainExists === false ? '🆕 À créer' : '⚪ Non spécifié'}</td></tr>`,
            `<tr><td style="padding: 5px 10px; color: #6c757d;">Hébergement:</td><td style="padding: 5px 10px;">${this.formData.hostingExists === true ? '✅ Existant' : this.formData.hostingExists === false ? '🆕 À fournir' : '⚪ Non spécifié'}</td></tr>`,
            `<tr><td style="padding: 5px 10px; color: #6c757d;">Budget estimé:</td><td style="padding: 5px 10px;"><strong style="color: #28a745; font-size: 16px;">${this.formData.budget}</strong></td></tr>`,
            `<tr><td style="padding: 5px 10px; color: #6c757d;">Deadline:</td><td style="padding: 5px 10px;"><strong style="color: #dc3545;">${this.formData.deadline}</strong></td></tr>`,
            `</table>`,
            `</div>`,

            // Section 8: Support & Formation
            `<div style="background: #cce5ff; padding: 15px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #004085;">`,
            `<h4 style="color: #004085; margin-top: 0;">🎧 7. Support & Formation</h4>`,
            `<table style="width: 100%; border-collapse: collapse;">`,
            `<tr><td style="padding: 5px 10px; color: #6c757d;">Formation demandée:</td><td style="padding: 5px 10px;">${this.formData.maintenanceNeeded ? '✅ Oui' : '❌ Non'}</td></tr>`,
            `<tr><td style="padding: 5px 10px; color: #6c757d;">Support mensuel:</td><td style="padding: 5px 10px;">${this.formData.monthlySupport ? '✅ Oui' : '❌ Non'}</td></tr>`,
            `</table>`,
            `</div>`,

            `<hr style="margin: 20px 0; border: none; border-top: 1px solid #ddd;">`,
            `<p style="color: #6c757d; font-size: 12px; text-align: center;">`,
            `<em>📅 Demande envoyée le ${new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</em>`,
            `</p>`
        ];

        const leadData = {
            name: `🌐 Projet Web - ${this.formData.companyName} (${this.formData.contactName})`,
            phone: this.formData.phone,
            email_from: this.formData.email,
            contact_name: this.formData.contactName,
            description: descriptionParts.join(''),
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

    private getSelectedOptionsAsBadges(obj: any, color: string = '#114d5a'): string {
        const labels: { [key: string]: string } = {
            // Pages
            home: 'Accueil',
            about: 'À propos',
            services: 'Services',
            blog: 'Blog',
            contact: 'Contact',
            // Features
            contactForm: 'Formulaire de contact',
            booking: 'Réservation',
            payment: 'Paiement en ligne',
            memberArea: 'Espace membre',
            chat: 'Chat en direct',
            newsletter: 'Newsletter',
            // Content
            text: 'Textes',
            images: 'Images',
            logo: 'Logo',
            video: 'Vidéo'
        };

        const badges = Object.keys(obj)
            .filter(key => key !== 'other' && obj[key])
            .map(key => `<span style="background: ${color}; color: white; padding: 3px 10px; border-radius: 12px; font-size: 12px; margin: 2px; display: inline-block;">${labels[key] || key}</span>`)
            .join(' ');

        const otherBadge = obj.other ? `<span style="background: #6c757d; color: white; padding: 3px 10px; border-radius: 12px; font-size: 12px; margin: 2px; display: inline-block;">Autre: ${obj.other}</span>` : '';

        return badges + otherBadge || '<span style="color: #6c757d; font-style: italic;">Aucune sélection</span>';
    }
}
