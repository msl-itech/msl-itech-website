import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit, OnDestroy {
  isMenuOpen = false;
  activeDropdown: string | null = null;
  isMobile: boolean = false;

  private resizeListener: (() => void) | null = null;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) { }

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.checkScreenSize();
      this.resizeListener = this.checkScreenSize.bind(this);
      window.addEventListener('resize', this.resizeListener);
    }
  }

  ngOnDestroy() {
    if (isPlatformBrowser(this.platformId) && this.resizeListener) {
      window.removeEventListener('resize', this.resizeListener);
    }
  }

  checkScreenSize() {
    if (isPlatformBrowser(this.platformId)) {
      this.isMobile = window.innerWidth < 1201;
      if (!this.isMobile) {
        this.isMenuOpen = false;
        this.activeDropdown = null;
      }
    }
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
    if (!this.isMenuOpen) {
      this.activeDropdown = null;
    }
  }

  closeMenu() {
    this.isMenuOpen = false;
    this.activeDropdown = null;
  }

  toggleDropdown(dropdownName: string) {
    if (this.activeDropdown === dropdownName) {
      this.activeDropdown = null;
    } else {
      this.activeDropdown = dropdownName;
    }
  }

  openHorecaLink(event: Event): void {
    event.preventDefault();
    if (isPlatformBrowser(this.platformId)) {
      window.open('https://horeca.msl-itech.com', '_blank');
    }
    if (this.isMobile) {
      this.closeMenu();
    }
  }

  isDropdownOpen(menu: string): boolean {
    return this.activeDropdown === menu;
  }
}
