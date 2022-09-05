import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CauserieAddComponent } from './causerie-add.component';

describe('CauserieAddComponent', () => {
  let component: CauserieAddComponent;
  let fixture: ComponentFixture<CauserieAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CauserieAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CauserieAddComponent);
    component = fixture.componentInstance;
    // fixture.markForCheck();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
