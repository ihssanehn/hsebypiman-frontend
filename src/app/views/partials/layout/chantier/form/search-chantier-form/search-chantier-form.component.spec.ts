import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchChantierFormComponent } from './search-chantier-form.component';

describe('SearchChantierFormComponent', () => {
  let component: SearchChantierFormComponent;
  let fixture: ComponentFixture<SearchChantierFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchChantierFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchChantierFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
