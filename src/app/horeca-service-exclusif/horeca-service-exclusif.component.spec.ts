import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HorecaServiceExclusifComponent } from './horeca-service-exclusif.component';

describe('HorecaServiceExclusifComponent', () => {
  let component: HorecaServiceExclusifComponent;
  let fixture: ComponentFixture<HorecaServiceExclusifComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HorecaServiceExclusifComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HorecaServiceExclusifComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
