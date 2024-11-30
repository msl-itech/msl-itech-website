import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PricingOdooComponent } from './pricing-odoo.component';

describe('PricingOdooComponent', () => {
  let component: PricingOdooComponent;
  let fixture: ComponentFixture<PricingOdooComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PricingOdooComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PricingOdooComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
