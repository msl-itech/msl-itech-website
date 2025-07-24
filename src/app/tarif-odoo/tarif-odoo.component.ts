import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tarif-odoo',
  templateUrl: './tarif-odoo.component.html',
  styleUrl: './tarif-odoo.component.css',
})
export class TarifOdooComponent {
  constructor(private router: Router) {}

  goToRendezVous(): void {
    this.router.navigate(['/prendre-rendez-vous']);
  }
}
