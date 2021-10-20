import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidatePdpComponent } from './validate-pdp.component';

describe('ValidatePdpComponent', () => {
  let component: ValidatePdpComponent;
  let fixture: ComponentFixture<ValidatePdpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ValidatePdpComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ValidatePdpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
