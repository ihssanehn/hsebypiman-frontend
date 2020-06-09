import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchVehiculeFormComponent } from './search-vehicule-form.component';

describe('SearchVehiculeFormComponent', () => {
  let component: SearchVehiculeFormComponent;
  let fixture: ComponentFixture<SearchVehiculeFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchVehiculeFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchVehiculeFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
