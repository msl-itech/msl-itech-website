import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  isMenuOpen = false;
  isDropdownOpen = false;

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  // Optionnel : Fermer le menu lorsqu'un lien est cliqué (mobile)
  closeMenu() {
    this.isMenuOpen = false;
    this.isDropdownOpen = false;
  }

  onDropdownClick(event: Event): void {
    event.preventDefault();
    this.toggleDropdown();
  }
  isSidebarActive: boolean = false;
  activeSubmenus: { [key: string]: boolean } = {};

  toggleSidebar(): void {
    this.isSidebarActive = !this.isSidebarActive;
  }

  toggleSubmenu(menu: string): void {
    for (let key in this.activeSubmenus) {
      if (key !== menu) {
        this.activeSubmenus[key] = false;
      }
    }
    this.activeSubmenus[menu] = !this.activeSubmenus[menu];
  }

  isMobile: boolean = false;

ngOnInit() {
  this.checkScreenSize();
  window.addEventListener('resize', () => this.checkScreenSize());
}

checkScreenSize() {
  this.isMobile = window.innerWidth < 768; // Ajustez la valeur selon vos besoins
}

ngOnDestroy() {
  window.removeEventListener('resize', () => this.checkScreenSize());
}
}
