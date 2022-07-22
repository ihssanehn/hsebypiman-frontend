import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormationAdminComponent } from './formation-admin.component';

describe('FormationAdminComponent', () => {
  let component: FormationAdminComponent;
  let fixture: ComponentFixture<FormationAdminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormationAdminComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormationAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
