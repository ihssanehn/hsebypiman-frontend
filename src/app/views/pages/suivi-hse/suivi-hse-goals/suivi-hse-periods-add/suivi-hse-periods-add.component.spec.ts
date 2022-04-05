import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SuiviHsePeriodsAddComponent } from './suivi-hse-periods-add.component';

describe('SuiviHsePeriodsAddComponent', () => {
  let component: SuiviHsePeriodsAddComponent;
  let fixture: ComponentFixture<SuiviHsePeriodsAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SuiviHsePeriodsAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SuiviHsePeriodsAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
