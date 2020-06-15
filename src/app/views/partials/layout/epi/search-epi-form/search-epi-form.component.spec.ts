import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchEpiFormComponent } from './search-epi-form.component';

describe('SearchEpiFormComponent', () => {
  let component: SearchEpiFormComponent;
  let fixture: ComponentFixture<SearchEpiFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchEpiFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchEpiFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
