import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PagePackageComponent } from './page-package.component';

describe('PagePackageComponent', () => {
  let component: PagePackageComponent;
  let fixture: ComponentFixture<PagePackageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PagePackageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PagePackageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
