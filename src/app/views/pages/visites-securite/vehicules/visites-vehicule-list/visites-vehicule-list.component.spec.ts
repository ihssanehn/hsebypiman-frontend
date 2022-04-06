import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VisitesVehiculeListComponent } from './visites-vehicule-list.component';

describe('VisitesListComponent', () => {
  let component: VisitesVehiculeListComponent;
  let fixture: ComponentFixture<VisitesVehiculeListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VisitesVehiculeListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VisitesVehiculeListComponent);
    component = fixture.componentInstance;
    // fixture.markForCheck();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
