import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModulesAdminComponent } from './modules-admin.component';

describe('ModulesAdminComponent', () => {
  let component: ModulesAdminComponent;
  let fixture: ComponentFixture<ModulesAdminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModulesAdminComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModulesAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
