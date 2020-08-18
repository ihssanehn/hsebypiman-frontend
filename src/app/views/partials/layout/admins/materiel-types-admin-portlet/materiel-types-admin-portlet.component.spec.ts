import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterielTypesAdminPortletComponent } from './materiel-types-admin-portlet.component';

describe('MaterielTypesAdminPortletComponent', () => {
  let component: MaterielTypesAdminPortletComponent;
  let fixture: ComponentFixture<MaterielTypesAdminPortletComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MaterielTypesAdminPortletComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MaterielTypesAdminPortletComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
