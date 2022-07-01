import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionSlideComponent } from './question-slide.component';

describe('QuestionSlideComponent', () => {
  let component: QuestionSlideComponent;
  let fixture: ComponentFixture<QuestionSlideComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuestionSlideComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionSlideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
