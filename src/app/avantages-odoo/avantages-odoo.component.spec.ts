import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvantagesOdooComponent } from './avantages-odoo.component';

describe('AvantagesOdooComponent', () => {
  let component: AvantagesOdooComponent;
  let fixture: ComponentFixture<AvantagesOdooComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AvantagesOdooComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AvantagesOdooComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
