import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VsFormHeadComponent } from './vs-form-head.component';

describe('VsFormHeadComponent', () => {
  let component: VsFormHeadComponent;
  let fixture: ComponentFixture<VsFormHeadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VsFormHeadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VsFormHeadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
