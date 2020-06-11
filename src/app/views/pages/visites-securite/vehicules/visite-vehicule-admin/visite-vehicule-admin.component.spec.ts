import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VisiteVehiculeAdminComponent } from './visite-vehicule-admin.component';

describe('VisiteVehiculeAdminComponent', () => {
  let component: VisiteVehiculeAdminComponent;
  let fixture: ComponentFixture<VisiteVehiculeAdminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VisiteVehiculeAdminComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VisiteVehiculeAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
