import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-horeca-formules',
  templateUrl: './horeca-formules.component.html',
  styleUrl: './horeca-formules.component.css'
})
export class HorecaFormulesComponent implements OnInit {

  ngOnInit() {
    // Gestion de l'affichage des champs d'adresse
    const formatRadios = document.querySelectorAll('input[name="demoFormat"]');
    const locationDetails = document.querySelector('.location-details') as HTMLElement;

    formatRadios.forEach(radio => {
      radio.addEventListener('change', (e: Event) => {
        const target = e.target as HTMLInputElement;
        if (locationDetails) {
          locationDetails.style.display = target.value === 'onsite' ? 'block' : 'none';
        }
      });
    });
  }
}
