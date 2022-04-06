import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RemonteeFiltersComponent } from './remontee-filters.component';

describe('RemonteeFiltersComponent', () => {
  let component: RemonteeFiltersComponent;
  let fixture: ComponentFixture<RemonteeFiltersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RemonteeFiltersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RemonteeFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
