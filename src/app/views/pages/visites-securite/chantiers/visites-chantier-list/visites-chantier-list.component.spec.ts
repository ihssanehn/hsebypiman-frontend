import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VisitesChantierListComponent } from './visites-chantier-list.component';

describe('VisitesListComponent', () => {
  let component: VisitesChantierListComponent;
  let fixture: ComponentFixture<VisitesChantierListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VisitesChantierListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VisitesChantierListComponent);
    component = fixture.componentInstance;
    // fixture.markForCheck();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
