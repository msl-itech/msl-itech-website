import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TextVideoSectionComponent } from './text-video-section.component';

describe('TextVideoSectionComponent', () => {
  let component: TextVideoSectionComponent;
  let fixture: ComponentFixture<TextVideoSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TextVideoSectionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TextVideoSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
