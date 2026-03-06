import { Component, Input, OnDestroy, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import {
  ResponsiveImageConfig,
  ResponsiveImageService,
} from '../services/responsive-image.service';

@Component({
  selector: 'app-slider-moderne',
  templateUrl: './slider-moderne.component.html',
  styleUrls: ['./slider-moderne.component.scss'],
})
export class SliderModerneComponent implements OnInit, OnDestroy {
  @Input() slides: any[] = [];

  currentSlide = 0;
  previousSlide = -1;
  private intervalId: any;
  private autoPlayDelay = 6000; // Plus lent pour laisser lire
  private translateSubscription: Subscription = new Subscription();

  constructor(
    private router: Router,
    private translate: TranslateService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  ngOnInit() {
    this.initializeSlides();
    this.startAutoPlay();

    // S'abonner aux changements de langue pour mettre à jour les slides
    this.translateSubscription = this.translate.onLangChange.subscribe(() => {
      this.initializeSlides();
    });
  }

  ngOnDestroy() {
    this.stopAutoPlay();
    this.translateSubscription.unsubscribe();
  }

  private initializeSlides() {
    // Si les slides ne sont pas passés en @Input, on les initialise ici
    if (this.slides.length === 0) {
      this.slides = [
        {
          id: 'slide1',
          // Configuration d'image responsive pour slide1 (image la plus lourde)
          imageConfig: {
            mobile: '../../assets/img/accueil/Slide1-mobile.webp',
            tablet: '../../assets/img/accueil/Slide1-tablet.webp',
            desktop: '../../assets/img/accueil/Slide1-min.webp',
            alt: 'Gérez simplement, innovez différemment avec MSL Itech',
            loading: 'eager' as const, // Au-dessus du pli
            fetchpriority: 'high' as const, // Optimisation LCP
          } as ResponsiveImageConfig,
          fallbackSrc: '../../assets/img/accueil/Slide1-min.webp',
          title: this.translate.instant('COMPONENTS.SLIDER.SLIDE1.TITLE'),
          highlight: this.translate.instant('COMPONENTS.SLIDER.SLIDE1.HIGHLIGHT'),
          description: this.translate.instant(
            'COMPONENTS.SLIDER.SLIDE1.DESCRIPTION'
          ),
          buttons: [
            {
              text: this.translate.instant('BUTTONS.CONTACT_US'),
              link: 'contact',
              color: '#ffcc00',
              textColor: '#000000',
            },
            {
              text: this.translate.instant('BUTTONS.BOOK_DEMO'),
              link: 'reserver-demo',
              color: '#114D5A',
              textColor: '#ffffff',
            },
          ],
        },
        {
          id: 'slide2',
          // Configuration d'image responsive pour slide2
          imageConfig: {
            mobile: '../../assets/img/accueil/femme_slide2-mobile.webp',
            tablet: '../../assets/img/accueil/femme_slide2-tablet.webp',
            desktop: '../../assets/img/accueil/femme_slide2.webp',
            alt: 'Nous sommes partenaire Odoo',
            loading: 'lazy' as const,
          } as ResponsiveImageConfig,
          fallbackSrc: '../../assets/img/accueil/femme_slide2.webp',
          title: this.translate.instant('COMPONENTS.SLIDER.SLIDE2.TITLE'),
          highlight: this.translate.instant('COMPONENTS.SLIDER.SLIDE2.HIGHLIGHT'),
          description: this.translate.instant(
            'COMPONENTS.SLIDER.SLIDE2.DESCRIPTION'
          ),
          buttons: [],
        },
        {
          id: 'slide3',
          // Configuration d'image responsive pour slide3
          imageConfig: {
            mobile: '../../assets/img/accueil/man3-mobile.webp',
            tablet: '../../assets/img/accueil/man3-tablet.webp',
            desktop: '../../assets/img/accueil/man3.jpg',
            alt: 'Support 6J/7 24/24 - Français/Anglais',
            loading: 'lazy' as const,
          } as ResponsiveImageConfig,
          fallbackSrc: '../../assets/img/accueil/man3.jpg',
          title: this.translate.instant('COMPONENTS.SLIDER.SLIDE3.TITLE'),
          highlight: this.translate.instant('COMPONENTS.SLIDER.SLIDE3.HIGHLIGHT'),
          description: this.translate.instant(
            'COMPONENTS.SLIDER.SLIDE3.DESCRIPTION'
          ),
          buttons: [
            {
              text: this.translate.instant('BUTTONS.CONTACT_US'),
              link: 'about',
              color: '#ffcc00',
              textColor: '#000000',
            },
          ],
        },
      ];
    }
  }

  next() {
    this.stopAutoPlay();
    this.previousSlide = this.currentSlide;
    this.currentSlide = (this.currentSlide + 1) % this.slides.length;
    this.startAutoPlay();
  }

  prev() {
    this.stopAutoPlay();
    this.previousSlide = this.currentSlide;
    this.currentSlide = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
    this.startAutoPlay();
  }

  navigateTo(link: string) {
    this.router.navigate([link]);
  }

  private startAutoPlay() {
    if (isPlatformBrowser(this.platformId)) {
      this.intervalId = setInterval(() => {
        this.next();
      }, this.autoPlayDelay);
    }
  }

  private stopAutoPlay() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }
}
