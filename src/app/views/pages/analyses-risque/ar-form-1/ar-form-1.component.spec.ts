import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArForm1Component } from './ar-form-1.component';

describe('ArForm1Component', () => {
  let component: ArForm1Component;
  let fixture: ComponentFixture<ArForm1Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArForm1Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArForm1Component);
    component = fixture.componentInstance;
    // fixture.markForCheck();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
