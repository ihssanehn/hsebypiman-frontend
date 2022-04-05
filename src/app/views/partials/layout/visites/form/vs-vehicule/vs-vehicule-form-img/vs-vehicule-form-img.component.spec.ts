import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VsVehiculeFormImgComponent } from './vs-vehicule-form-img.component';

describe('VsVehiculeFormImgComponent', () => {
  let component: VsVehiculeFormImgComponent;
  let fixture: ComponentFixture<VsVehiculeFormImgComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VsVehiculeFormImgComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VsVehiculeFormImgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
