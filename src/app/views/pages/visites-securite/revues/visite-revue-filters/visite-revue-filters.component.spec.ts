import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VisiteChantierFiltersComponent } from './visite-revue-filters.component';

describe('VisiteChantierFiltersComponent', () => {
  let component: VisiteChantierFiltersComponent;
  let fixture: ComponentFixture<VisiteChantierFiltersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VisiteChantierFiltersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VisiteChantierFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
