import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VisiteRevueAdminComponent } from './visite-revue-admin.component';

describe('VisiteRevueAdminComponent', () => {
  let component: VisiteRevueAdminComponent;
  let fixture: ComponentFixture<VisiteRevueAdminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VisiteRevueAdminComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VisiteRevueAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
