import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchMaterielFormComponent } from './search-materiel-form.component';

describe('SearchMaterielFormComponent', () => {
  let component: SearchMaterielFormComponent;
  let fixture: ComponentFixture<SearchMaterielFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchMaterielFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchMaterielFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
