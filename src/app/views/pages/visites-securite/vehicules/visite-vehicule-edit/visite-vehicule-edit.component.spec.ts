import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VisiteVehiculeEditComponent } from './visite-vehicule-edit.component';

describe('VisiteVehiculeEditComponent', () => {
  let component: VisiteVehiculeEditComponent;
  let fixture: ComponentFixture<VisiteVehiculeEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VisiteVehiculeEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VisiteVehiculeEditComponent);
    component = fixture.componentInstance;
    // fixture.markForCheck();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
