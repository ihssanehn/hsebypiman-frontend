import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SalariesAdminComponent } from './salaries-admin.component';

describe('SalariesAdminComponent', () => {
  let component: SalariesAdminComponent;
  let fixture: ComponentFixture<SalariesAdminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SalariesAdminComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SalariesAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
