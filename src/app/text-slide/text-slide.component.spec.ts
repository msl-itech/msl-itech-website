import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TextSlideComponent } from './text-slide.component';

describe('TextSlideComponent', () => {
  let component: TextSlideComponent;
  let fixture: ComponentFixture<TextSlideComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TextSlideComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TextSlideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
