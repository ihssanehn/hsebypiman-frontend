import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArAdminComponent } from './ar-admin.component';

describe('ArAdminComponent', () => {
  let component: ArAdminComponent;
  let fixture: ComponentFixture<ArAdminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArAdminComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
