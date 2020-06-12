import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VisiteOutillageAdminComponent } from './visite-outillage-admin.component';

describe('VisiteOutillageAdminComponent', () => {
  let component: VisiteOutillageAdminComponent;
  let fixture: ComponentFixture<VisiteOutillageAdminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VisiteOutillageAdminComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VisiteOutillageAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
