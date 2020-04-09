import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VisitesListComponent } from './visites-list.component';

describe('VisitesListComponent', () => {
  let component: VisitesListComponent;
  let fixture: ComponentFixture<VisitesListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VisitesListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VisitesListComponent);
    component = fixture.componentInstance;
    // fixture.markForCheck();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
