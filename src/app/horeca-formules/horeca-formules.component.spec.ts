import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HorecaFormulesComponent } from './horeca-formules.component';

describe('HorecaFormulesComponent', () => {
  let component: HorecaFormulesComponent;
  let fixture: ComponentFixture<HorecaFormulesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HorecaFormulesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HorecaFormulesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
