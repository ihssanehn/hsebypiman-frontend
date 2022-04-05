import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SuiviSalarieDashComponent } from './suivi-salarie-dash.component';

describe('SuiviSalarieDashComponent', () => {
  let component: SuiviSalarieDashComponent;
  let fixture: ComponentFixture<SuiviSalarieDashComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SuiviSalarieDashComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SuiviSalarieDashComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
