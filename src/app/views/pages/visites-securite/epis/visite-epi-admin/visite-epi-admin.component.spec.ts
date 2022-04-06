import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VisiteEpiAdminComponent } from './visite-epi-admin.component';

describe('VisiteEpiAdminComponent', () => {
  let component: VisiteEpiAdminComponent;
  let fixture: ComponentFixture<VisiteEpiAdminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VisiteEpiAdminComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VisiteEpiAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
