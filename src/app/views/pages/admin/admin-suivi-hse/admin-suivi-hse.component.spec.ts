import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminSuiviHseComponent } from './admin-suivi-hse.component';

describe('AdminSuiviHseComponent', () => {
  let component: AdminSuiviHseComponent;
  let fixture: ComponentFixture<AdminSuiviHseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminSuiviHseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminSuiviHseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
