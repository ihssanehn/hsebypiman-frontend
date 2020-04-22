import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArFiltersComponent } from './ar-filters.component';

describe('ArFiltersComponent', () => {
  let component: ArFiltersComponent;
  let fixture: ComponentFixture<ArFiltersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArFiltersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
