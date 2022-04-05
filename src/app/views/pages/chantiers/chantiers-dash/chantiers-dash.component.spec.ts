import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChantiersDashComponent } from './chantiers-dash.component';

describe('ChantiersDashComponent', () => {
  let component: ChantiersDashComponent;
  let fixture: ComponentFixture<ChantiersDashComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChantiersDashComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChantiersDashComponent);
    component = fixture.componentInstance;
    // fixture.markForCheck();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
