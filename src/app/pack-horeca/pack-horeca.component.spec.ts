import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PackHorecaComponent } from './pack-horeca.component';

describe('PackHorecaComponent', () => {
  let component: PackHorecaComponent;
  let fixture: ComponentFixture<PackHorecaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PackHorecaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PackHorecaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
