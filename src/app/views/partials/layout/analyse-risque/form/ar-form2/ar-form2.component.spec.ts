import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArForm2Component } from './ar-form2.component';

describe('ArForm2Component', () => {
  let component: ArForm2Component;
  let fixture: ComponentFixture<ArForm2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArForm2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArForm2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
