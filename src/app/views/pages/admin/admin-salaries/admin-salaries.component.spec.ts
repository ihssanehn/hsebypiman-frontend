import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminSalariesComponent } from './admin-salaries.component';

describe('AdminSalariesComponent', () => {
  let component: AdminSalariesComponent;
  let fixture: ComponentFixture<AdminSalariesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminSalariesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminSalariesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
