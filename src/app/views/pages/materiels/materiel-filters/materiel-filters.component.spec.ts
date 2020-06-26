import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterielFiltersComponent } from './materiel-filters.component';

describe('MaterielFiltersComponent', () => {
  let component: MaterielFiltersComponent;
  let fixture: ComponentFixture<MaterielFiltersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MaterielFiltersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MaterielFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
