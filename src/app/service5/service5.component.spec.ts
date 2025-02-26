import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Service5Component } from './service5.component';

describe('Service5Component', () => {
  let component: Service5Component;
  let fixture: ComponentFixture<Service5Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Service5Component]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(Service5Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
