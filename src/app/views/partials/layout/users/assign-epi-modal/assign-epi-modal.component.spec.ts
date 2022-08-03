import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignEpiModalComponent } from './assign-epi-modal.component';

describe('AddPhotoProfilModalComponent', () => {
  let component: AssignEpiModalComponent;
  let fixture: ComponentFixture<AssignEpiModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssignEpiModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignEpiModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
