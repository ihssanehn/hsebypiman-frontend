import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditAccueilSecuModalComponent } from './edit-accueil-secu-modal.component';

describe('EditAccueilSecuModalComponent', () => {
  let component: EditAccueilSecuModalComponent;
  let fixture: ComponentFixture<EditAccueilSecuModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditAccueilSecuModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditAccueilSecuModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
