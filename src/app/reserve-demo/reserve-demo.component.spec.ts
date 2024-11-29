import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReserveDemoComponent } from './reserve-demo.component';

describe('ReserveDemoComponent', () => {
  let component: ReserveDemoComponent;
  let fixture: ComponentFixture<ReserveDemoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReserveDemoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReserveDemoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
