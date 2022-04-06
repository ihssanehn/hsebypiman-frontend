import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VisiteVehiculeAddComponent } from './visite-vehicule-add.component';

describe('VisiteVehiculeAddComponent', () => {
  let component: VisiteVehiculeAddComponent;
  let fixture: ComponentFixture<VisiteVehiculeAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VisiteVehiculeAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VisiteVehiculeAddComponent);
    component = fixture.componentInstance;
    // fixture.markForCheck();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
