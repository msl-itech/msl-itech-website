import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableauCRMVENTEComponent } from './tableau-crm-vente.component';

describe('TableauCRMVENTEComponent', () => {
  let component: TableauCRMVENTEComponent;
  let fixture: ComponentFixture<TableauCRMVENTEComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TableauCRMVENTEComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TableauCRMVENTEComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
