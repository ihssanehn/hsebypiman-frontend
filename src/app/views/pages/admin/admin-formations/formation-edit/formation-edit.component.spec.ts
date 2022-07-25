import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormationEditComponent } from './formation-edit.component';

describe('FormationEditComponent', () => {
  let component: FormationEditComponent;
  let fixture: ComponentFixture<FormationEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormationEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormationEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
