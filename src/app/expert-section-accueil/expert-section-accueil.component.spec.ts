import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpertSectionAccueilComponent } from './expert-section-accueil.component';

describe('ExpertSectionAccueilComponent', () => {
  let component: ExpertSectionAccueilComponent;
  let fixture: ComponentFixture<ExpertSectionAccueilComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ExpertSectionAccueilComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ExpertSectionAccueilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
