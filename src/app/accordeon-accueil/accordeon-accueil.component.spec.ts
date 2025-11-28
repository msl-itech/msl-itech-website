import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccordeonAccueilComponent } from './accordeon-accueil.component';

describe('AccordeonAccueilComponent', () => {
  let component: AccordeonAccueilComponent;
  let fixture: ComponentFixture<AccordeonAccueilComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AccordeonAccueilComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AccordeonAccueilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
