import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VisiteOutillageFiltersComponent } from './visite-outillage-filters.component';

describe('VisiteOutillageFiltersComponent', () => {
  let component: VisiteOutillageFiltersComponent;
  let fixture: ComponentFixture<VisiteOutillageFiltersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VisiteOutillageFiltersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VisiteOutillageFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
