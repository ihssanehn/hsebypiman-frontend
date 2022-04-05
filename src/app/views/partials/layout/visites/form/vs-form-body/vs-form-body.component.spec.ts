import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VsFormBodyComponent } from './vs-form-body.component';

describe('VsFormBodyComponent', () => {
  let component: VsFormBodyComponent;
  let fixture: ComponentFixture<VsFormBodyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VsFormBodyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VsFormBodyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
