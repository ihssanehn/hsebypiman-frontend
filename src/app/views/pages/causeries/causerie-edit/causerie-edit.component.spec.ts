import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CauserieEditComponent } from './causerie-edit.component';

describe('CauserieEditComponent', () => {
  let component: CauserieEditComponent;
  let fixture: ComponentFixture<CauserieEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CauserieEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CauserieEditComponent);
    component = fixture.componentInstance;
    // fixture.markForCheck();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
