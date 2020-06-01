import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VisitesEpiListComponent } from './visites-epi-list.component';

describe('VisitesListComponent', () => {
  let component: VisitesEpiListComponent;
  let fixture: ComponentFixture<VisitesEpiListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VisitesEpiListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VisitesEpiListComponent);
    component = fixture.componentInstance;
    // fixture.markForCheck();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
