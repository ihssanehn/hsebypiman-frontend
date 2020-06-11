import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddVehiculeFormComponent } from './add-vehicule-form.component

describe('AddVehiculeFormComponent', () => {
  let component: AddVehiculeFormComponent;
  let fixture: ComponentFixture<AddVehiculeFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddVehiculeFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddVehiculeFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
