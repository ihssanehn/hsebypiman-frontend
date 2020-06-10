import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchOutillageFormComponent } from './search-outillage-form.component';

describe('SearchOutillageFormComponent', () => {
  let component: SearchOutillageFormComponent;
  let fixture: ComponentFixture<SearchOutillageFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchOutillageFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchOutillageFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
