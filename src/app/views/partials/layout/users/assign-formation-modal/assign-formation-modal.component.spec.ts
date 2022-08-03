import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignFormationModalComponent } from './assign-formation-modal.component';

describe('AddPhotoProfilModalComponent', () => {
  let component: AssignFormationModalComponent;
  let fixture: ComponentFixture<AssignFormationModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssignFormationModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignFormationModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
