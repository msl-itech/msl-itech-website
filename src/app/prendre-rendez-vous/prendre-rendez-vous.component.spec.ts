import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrendreRendezVousComponent } from './prendre-rendez-vous.component';

describe('PrendreRendezVousComponent', () => {
  let component: PrendreRendezVousComponent;
  let fixture: ComponentFixture<PrendreRendezVousComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PrendreRendezVousComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PrendreRendezVousComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
