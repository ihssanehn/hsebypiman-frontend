import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminVisiteVehiculeComponent } from './admin-visite-vehicule.component';

describe('AdminVisiteVehiculeComponent', () => {
  let component: AdminVisiteVehiculeComponent;
  let fixture: ComponentFixture<AdminVisiteVehiculeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminVisiteVehiculeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminVisiteVehiculeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
