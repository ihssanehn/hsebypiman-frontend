import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminVisiteOutillageComponent } from './admin-visite-outillage.component';

describe('AdminVisiteOutillageComponent', () => {
  let component: AdminVisiteOutillageComponent;
  let fixture: ComponentFixture<AdminVisiteOutillageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminVisiteOutillageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminVisiteOutillageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
