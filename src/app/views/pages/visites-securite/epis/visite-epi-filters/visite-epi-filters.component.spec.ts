import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VisiteEpiFiltersComponent } from './visite-epi-filters.component';

describe('VisiteEpiFiltersComponent', () => {
  let component: VisiteEpiFiltersComponent;
  let fixture: ComponentFixture<VisiteEpiFiltersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VisiteEpiFiltersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VisiteEpiFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
