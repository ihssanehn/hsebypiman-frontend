import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VsFormSignaturesComponent } from './vs-form-signatures.component';

describe('VsFormSignaturesComponent', () => {
  let component: VsFormSignaturesComponent;
  let fixture: ComponentFixture<VsFormSignaturesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VsFormSignaturesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VsFormSignaturesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
