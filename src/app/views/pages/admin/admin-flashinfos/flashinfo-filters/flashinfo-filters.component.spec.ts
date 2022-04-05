import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FlashInfoFiltersComponent } from './flashinfo-filters.component';

describe('FlashInfoFiltersComponent', () => {
  let component: FlashInfoFiltersComponent;
  let fixture: ComponentFixture<FlashInfoFiltersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlashInfoFiltersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlashInfoFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
