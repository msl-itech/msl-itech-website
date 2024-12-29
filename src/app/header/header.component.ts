import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  isMenuOpen = false;
  activeDropdown: string | null = null; // Pour gérer quel sous-menu est ouvert
  isMobile: boolean = false;

  constructor() {}

  ngOnInit() {
    this.checkScreenSize();
    window.addEventListener('resize', this.checkScreenSize.bind(this));
  }

  ngOnDestroy() {
    window.removeEventListener('resize', this.checkScreenSize.bind(this));
  }

  checkScreenSize() {
    this.isMobile = window.innerWidth < 1025; // Ajustez la valeur selon vos besoins
    if (!this.isMobile) {
      this.isMenuOpen = false;
      this.activeDropdown = null;
    }
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
    if (!this.isMenuOpen) {
      this.activeDropdown = null; // Fermer tous les sous-menus lorsque le menu principal est fermé
    }
  }

  closeMenu() {
    this.isMenuOpen = false;
    this.activeDropdown = null;
  }

  toggleDropdown(menu: string) {
    if (this.activeDropdown === menu) {
      this.activeDropdown = null; // Fermer si déjà ouvert
    } else {
      this.activeDropdown = menu; // Ouvrir le nouveau sous-menu et fermer les autres
    }
  }

  isDropdownOpen(menu: string): boolean {
    return this.activeDropdown === menu;
  }
}
