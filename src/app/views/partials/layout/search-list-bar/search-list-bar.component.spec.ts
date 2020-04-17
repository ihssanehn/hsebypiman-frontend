import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchListBarComponent } from './search-list-bar.component';

describe('SearchListBarComponent', () => {
  let component: SearchListBarComponent;
  let fixture: ComponentFixture<SearchListBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchListBarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchListBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
