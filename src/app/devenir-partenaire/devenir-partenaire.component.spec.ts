import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DevenirPartenaireComponent } from './devenir-partenaire.component';

describe('DevenirPartenaireComponent', () => {
  let component: DevenirPartenaireComponent;
  let fixture: ComponentFixture<DevenirPartenaireComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DevenirPartenaireComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DevenirPartenaireComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
