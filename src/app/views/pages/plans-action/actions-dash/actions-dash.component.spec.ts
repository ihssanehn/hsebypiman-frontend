import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionsDashComponent } from './actions-dash.component';

describe('ActionsDashComponent', () => {
  let component: ActionsDashComponent;
  let fixture: ComponentFixture<ActionsDashComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActionsDashComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActionsDashComponent);
    component = fixture.componentInstance;
    // fixture.markForCheck();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
