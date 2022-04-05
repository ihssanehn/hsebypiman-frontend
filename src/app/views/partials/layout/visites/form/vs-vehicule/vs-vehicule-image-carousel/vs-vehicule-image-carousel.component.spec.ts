import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VsVehiculeImageCarouselComponent } from './vs-vehicule-image-carousel.component';

describe('VsVehiculeImageCarouselComponent', () => {
  let component: VsVehiculeImageCarouselComponent;
  let fixture: ComponentFixture<VsVehiculeImageCarouselComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VsVehiculeImageCarouselComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VsVehiculeImageCarouselComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
