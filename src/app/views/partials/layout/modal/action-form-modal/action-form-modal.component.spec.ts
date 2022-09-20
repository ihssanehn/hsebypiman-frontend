import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionFormModalComponent } from './action-form-modal.component';

describe('ActionFormModalComponent', () => {
  let component: ActionFormModalComponent;
  let fixture: ComponentFixture<ActionFormModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActionFormModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActionFormModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
