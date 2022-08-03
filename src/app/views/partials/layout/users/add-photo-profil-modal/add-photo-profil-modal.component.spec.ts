import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPhotoProfilModalComponent } from './add-photo-profil-modal.component';

describe('AddPhotoProfilModalComponent', () => {
  let component: AddPhotoProfilModalComponent;
  let fixture: ComponentFixture<AddPhotoProfilModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddPhotoProfilModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddPhotoProfilModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
