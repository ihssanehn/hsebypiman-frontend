import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormationFiltersComponent } from './formation-filters.component';

describe('FormationFiltersComponent', () => {
  let component: FormationFiltersComponent;
  let fixture: ComponentFixture<FormationFiltersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormationFiltersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormationFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
