import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimelineHorecaComponent } from './timeline-horeca.component';

describe('TimelineHorecaComponent', () => {
  let component: TimelineHorecaComponent;
  let fixture: ComponentFixture<TimelineHorecaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TimelineHorecaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TimelineHorecaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
