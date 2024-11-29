import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SoumettreBesoinComponent } from './soumettre-besoin.component';

describe('SoumettreBesoinComponent', () => {
  let component: SoumettreBesoinComponent;
  let fixture: ComponentFixture<SoumettreBesoinComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SoumettreBesoinComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SoumettreBesoinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
