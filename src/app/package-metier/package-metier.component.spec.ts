import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PackageMetierComponent } from './package-metier.component';

describe('PackageMetierComponent', () => {
  let component: PackageMetierComponent;
  let fixture: ComponentFixture<PackageMetierComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PackageMetierComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PackageMetierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
