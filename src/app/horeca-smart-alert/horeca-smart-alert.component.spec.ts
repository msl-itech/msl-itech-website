import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HorecaSmartAlertComponent } from './horeca-smart-alert.component';

describe('HorecaSmartAlertComponent', () => {
  let component: HorecaSmartAlertComponent;
  let fixture: ComponentFixture<HorecaSmartAlertComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HorecaSmartAlertComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HorecaSmartAlertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
