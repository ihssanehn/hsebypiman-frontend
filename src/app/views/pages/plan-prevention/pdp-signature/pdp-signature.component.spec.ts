import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PdpSignatureComponent } from './pdp-signature.component';

describe('PdpSignatureComponent', () => {
  let component: PdpSignatureComponent;
  let fixture: ComponentFixture<PdpSignatureComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PdpSignatureComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PdpSignatureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
