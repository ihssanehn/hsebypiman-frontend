import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RemonteesDashComponent } from './remontees-dash.component';

describe('RemonteesDashComponent', () => {
  let component: RemonteesDashComponent;
  let fixture: ComponentFixture<RemonteesDashComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RemonteesDashComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RemonteesDashComponent);
    component = fixture.componentInstance;
    // fixture.markForCheck();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
