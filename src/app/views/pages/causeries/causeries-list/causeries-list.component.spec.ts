import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CauseriesListComponent } from './causeries-list.component';

describe('CauseriesListComponent', () => {
  let component: CauseriesListComponent;
  let fixture: ComponentFixture<CauseriesListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CauseriesListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CauseriesListComponent);
    component = fixture.componentInstance;
    // fixture.markForCheck();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
