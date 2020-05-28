import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VisitesepiListComponent } from './visites-epi-list.component';

describe('VisitesListComponent', () => {
  let component: VisitesepiListComponent;
  let fixture: ComponentFixture<VisitesepiListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VisitesepiListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VisitesepiListComponent);
    component = fixture.componentInstance;
    // fixture.markForCheck();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
