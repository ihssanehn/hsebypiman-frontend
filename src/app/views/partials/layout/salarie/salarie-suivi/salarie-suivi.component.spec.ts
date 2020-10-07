import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SalarieSuiviComponent } from './salarie-suivi.component';

describe('SalarieSuiviComponent', () => {
  let component: SalarieSuiviComponent;
  let fixture: ComponentFixture<SalarieSuiviComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SalarieSuiviComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SalarieSuiviComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
