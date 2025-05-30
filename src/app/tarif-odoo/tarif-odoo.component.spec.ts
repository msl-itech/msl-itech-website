import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TarifOdooComponent } from './tarif-odoo.component';

describe('TarifOdooComponent', () => {
  let component: TarifOdooComponent;
  let fixture: ComponentFixture<TarifOdooComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TarifOdooComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TarifOdooComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
