import { Component, OnInit } from '@angular/core';
import AOS from 'aos';
@Component({
  selector: 'app-pricing-odoo',
  templateUrl: './pricing-odoo.component.html',
  styleUrl: './pricing-odoo.component.css'
})
export class PricingOdooComponent implements OnInit{
 
  ngOnInit(): void {
  AOS.init({
    duration: 1000, // Durée de l'animation en millisecondes
    easing: 'ease-in-out', // Type d'animation
    once: true, // Si true, l'animation ne se répète qu'une seule fois
    mirror: false // Si true, les éléments sont animés lors du défilement vers le haut
  }); 
}
}
