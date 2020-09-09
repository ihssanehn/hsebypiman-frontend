import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SuiviHseAdminComponent } from './suivi-hse-admin.component';

describe('SuiviHseAdminComponent', () => {
  let component: SuiviHseAdminComponent;
  let fixture: ComponentFixture<SuiviHseAdminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SuiviHseAdminComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SuiviHseAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
