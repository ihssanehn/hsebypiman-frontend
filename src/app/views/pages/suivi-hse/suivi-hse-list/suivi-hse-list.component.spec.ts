import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SuiviHseListComponent } from './suivi-hse-list.component';

describe('SuiviHseListComponent', () => {
  let component: SuiviHseListComponent;
  let fixture: ComponentFixture<SuiviHseListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SuiviHseListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SuiviHseListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
