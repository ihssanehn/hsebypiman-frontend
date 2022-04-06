import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArsDashComponent } from './ars-dash.component';

describe('ArsDashComponent', () => {
  let component: ArsDashComponent;
  let fixture: ComponentFixture<ArsDashComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArsDashComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArsDashComponent);
    component = fixture.componentInstance;
    // fixture.markForCheck();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
