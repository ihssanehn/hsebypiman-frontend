import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SuiviSalarieEditComponent } from './suivi-salarie-edit.component';

describe('SuiviSalarieEditComponent', () => {
  let component: SuiviSalarieEditComponent;
  let fixture: ComponentFixture<SuiviSalarieEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SuiviSalarieEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SuiviSalarieEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
