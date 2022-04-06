import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VisitesOutillageListComponent } from './visites-outillage-list.component';

describe('VisitesListComponent', () => {
  let component: VisitesOutillageListComponent;
  let fixture: ComponentFixture<VisitesOutillageListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VisitesOutillageListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VisitesOutillageListComponent);
    component = fixture.componentInstance;
    // fixture.markForCheck();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
