import { Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-tableau-crm-vente',
  templateUrl: './tableau-crm-vente.component.html',
  styleUrl: './tableau-crm-vente.component.css'
})
export class TableauCRMVENTEComponent {
  @ViewChild('scrollContainer') scrollContainer!: ElementRef;

  ngAfterViewInit(): void {
    const container = this.scrollContainer.nativeElement;

    // Centrer horizontalement et verticalement
    container.scrollLeft = (container.scrollWidth - container.clientWidth) / 2;
    container.scrollTop = (container.scrollHeight - container.clientHeight) / 2;
  }
}
