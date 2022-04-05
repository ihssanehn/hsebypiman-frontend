import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VssDashComponent } from './visites-securite-dash.component';

describe('VssDashComponent', () => {
  let component: VssDashComponent;
  let fixture: ComponentFixture<VssDashComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VssDashComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VssDashComponent);
    component = fixture.componentInstance;
    // fixture.markForCheck();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
