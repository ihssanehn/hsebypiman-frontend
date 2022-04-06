import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminVisiteEpiComponent } from './admin-visite-epi.component';

describe('AdminVisiteEpiComponent', () => {
  let component: AdminVisiteEpiComponent;
  let fixture: ComponentFixture<AdminVisiteEpiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminVisiteEpiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminVisiteEpiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
