import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-questionnaire-promo-bar',
  templateUrl: './questionnaire-promo-bar.component.html',
  styleUrls: ['./questionnaire-promo-bar.component.css']
})
export class QuestionnairePromoBarComponent implements OnInit {
  isVisible: boolean = true;
  isClosing: boolean = false;

  constructor(
    private router: Router,
    public translate: TranslateService
  ) {}

  ngOnInit(): void {
    // Vérifier si la barre a déjà été fermée dans cette session
    const isClosed = sessionStorage.getItem('questionnaire-promo-bar-closed');
    if (isClosed === 'true') {
      this.isVisible = false;
    }
  }

  navigateToQuestionnaire(): void {
    this.router.navigate(['/questionnaire']);
  }

  closeBar(): void {
    this.isClosing = true;
    setTimeout(() => {
      this.isVisible = false;
      // Mémoriser que la barre a été fermée pour cette session
      sessionStorage.setItem('questionnaire-promo-bar-closed', 'true');
    }, 300); // Correspond à la durée de l'animation
  }
}
