import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminVisiteChantierComponent } from './admin-visite-chantier.component';

describe('AdminVisiteChantierComponent', () => {
  let component: AdminVisiteChantierComponent;
  let fixture: ComponentFixture<AdminVisiteChantierComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminVisiteChantierComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminVisiteChantierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
