import { Component, OnDestroy, OnInit } from '@angular/core';
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
  slides: any[] = [];
  currentSlide = 0;
  intervalId: any;
  private translateSubscription: Subscription = new Subscription();

  constructor(
    private router: Router,
    private translate: TranslateService,
    private responsiveImageService: ResponsiveImageService
  ) {}

  ngOnInit() {
    this.loadSlides();
    this.startAutoSlide();

    // S'abonner aux changements de langue
    this.translateSubscription = this.translate.onLangChange.subscribe(() => {
      this.loadSlides();
    });
  }

  ngOnDestroy() {
    this.stopAutoSlide();
    this.translateSubscription.unsubscribe();
  }

  loadSlides() {
    this.slides = [
      {
        id: 'slide1',
        imageConfig: {
          mobile: '../../assets/img/accueil/Slide1-mobile.webp',
          tablet: '../../assets/img/accueil/Slide1-tablet.webp',
          desktop: '../../assets/img/accueil/Slide1-min.webp',
          alt: 'Gérez simplement, innovez différemment avec MSL Itech',
          loading: 'eager' as const,
          fetchpriority: 'high' as const,
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
            color: 'primary', // Changed to abstract color names for styling in SCSS
            textColor: '#000000',
          },
          {
            text: this.translate.instant('BUTTONS.BOOK_DEMO'),
            link: 'reserver-demo',
            color: 'secondary',
            textColor: '#ffffff',
          },
        ],
      },
      {
        id: 'slide2',
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
            color: 'primary',
            textColor: '#000000',
          },
        ],
      },
    ];
  }

  startAutoSlide() {
    this.intervalId = setInterval(() => this.nextSlide(), 6000);
  }

  stopAutoSlide() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  showSlide(index: number) {
    this.currentSlide = index;
  }

  nextSlide() {
    const nextIndex = (this.currentSlide + 1) % this.slides.length;
    this.showSlide(nextIndex);
  }

  prevSlide() {
    const prevIndex =
      (this.currentSlide - 1 + this.slides.length) % this.slides.length;
    this.showSlide(prevIndex);
  }

  navigateTo(link: string) {
    this.router.navigate([link]);
  }
}
