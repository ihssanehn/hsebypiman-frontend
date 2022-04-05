import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VisiteVehiculeDetailComponent } from './visite-vehicule-detail.component';

describe('VisiteVehiculeDetailComponent', () => {
  let component: VisiteVehiculeDetailComponent;
  let fixture: ComponentFixture<VisiteVehiculeDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VisiteVehiculeDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VisiteVehiculeDetailComponent);
    component = fixture.componentInstance;
    // fixture.markForCheck();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
