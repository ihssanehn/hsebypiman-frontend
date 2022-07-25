import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignActionModalComponent } from './assign-action-modal.component';

describe('AddPhotoProfilModalComponent', () => {
  let component: AssignActionModalComponent;
  let fixture: ComponentFixture<AssignActionModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssignActionModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignActionModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
