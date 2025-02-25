import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PackageMetierAccueilComponent } from './package-metier-accueil.component';

describe('PackageMetierAccueilComponent', () => {
  let component: PackageMetierAccueilComponent;
  let fixture: ComponentFixture<PackageMetierAccueilComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PackageMetierAccueilComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PackageMetierAccueilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
