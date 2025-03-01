import { Component } from '@angular/core';

@Component({
  selector: 'app-support',
  templateUrl: './support.component.html',
  styleUrl: './support.component.css',
})
export class SupportComponent {
  scrollToFaq(event: Event): void {
    event.preventDefault();
    const faqSection = document.getElementById('faq');
    if (faqSection) {
      faqSection.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  }
}
