import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EntrepriseFiltersComponent } from './entreprise-filters.component';

describe('EntrepriseFiltersComponent', () => {
  let component: EntrepriseFiltersComponent;
  let fixture: ComponentFixture<EntrepriseFiltersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EntrepriseFiltersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EntrepriseFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
