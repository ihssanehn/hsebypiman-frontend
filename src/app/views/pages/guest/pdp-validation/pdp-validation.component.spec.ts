import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PdpValidationComponent } from './pdp-validation.component';

describe('PdpValidationComponent', () => {
  let component: PdpValidationComponent;
  let fixture: ComponentFixture<PdpValidationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PdpValidationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PdpValidationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
