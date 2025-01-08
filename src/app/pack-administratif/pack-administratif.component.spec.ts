import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PackAdministratifComponent } from './pack-administratif.component';

describe('PackAdministratifComponent', () => {
  let component: PackAdministratifComponent;
  let fixture: ComponentFixture<PackAdministratifComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PackAdministratifComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PackAdministratifComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
