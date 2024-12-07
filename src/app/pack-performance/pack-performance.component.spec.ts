import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PackPerformanceComponent } from './pack-performance.component';

describe('PackPerformanceComponent', () => {
  let component: PackPerformanceComponent;
  let fixture: ComponentFixture<PackPerformanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PackPerformanceComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PackPerformanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
