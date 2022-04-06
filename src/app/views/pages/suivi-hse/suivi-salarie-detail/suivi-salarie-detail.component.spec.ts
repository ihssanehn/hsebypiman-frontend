import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SuiviSalarieDetailComponent } from './suivi-salarie-detail.component';

describe('SuiviSalarieDetailComponent', () => {
  let component: SuiviSalarieDetailComponent;
  let fixture: ComponentFixture<SuiviSalarieDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SuiviSalarieDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SuiviSalarieDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
