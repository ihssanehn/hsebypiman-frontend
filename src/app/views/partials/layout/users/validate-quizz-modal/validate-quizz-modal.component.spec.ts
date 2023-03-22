import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidateQuizzModalComponent } from './validate-quizz-modal.component';

describe('ValidateQuizzModalComponent', () => {
  let component: ValidateQuizzModalComponent;
  let fixture: ComponentFixture<ValidateQuizzModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ValidateQuizzModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ValidateQuizzModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
