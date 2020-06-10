import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchSalarieFormComponent } from './search-salarie-form.component';

describe('SearchSalarieFormComponent', () => {
  let component: SearchSalarieFormComponent;
  let fixture: ComponentFixture<SearchSalarieFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchSalarieFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchSalarieFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
