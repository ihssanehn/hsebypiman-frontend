import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VisitesRevueListComponent } from './visites-revue-list.component';

describe('VisitesListComponent', () => {
  let component: VisitesRevueListComponent;
  let fixture: ComponentFixture<VisitesRevueListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VisitesRevueListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VisitesRevueListComponent);
    component = fixture.componentInstance;
    // fixture.markForCheck();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
