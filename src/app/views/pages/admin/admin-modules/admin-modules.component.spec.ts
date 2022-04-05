import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminModulesComponent } from './admin-modules.component';

describe('AdminModulesComponent', () => {
  let component: AdminModulesComponent;
  let fixture: ComponentFixture<AdminModulesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminModulesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminModulesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
