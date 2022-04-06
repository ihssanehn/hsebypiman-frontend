import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VisiteChantierAdminComponent } from './visite-chantier-admin.component';

describe('VisiteChantierAdminComponent', () => {
  let component: VisiteChantierAdminComponent;
  let fixture: ComponentFixture<VisiteChantierAdminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VisiteChantierAdminComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VisiteChantierAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
