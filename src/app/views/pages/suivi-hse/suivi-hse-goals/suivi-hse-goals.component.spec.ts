import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SuiviHseGoalsComponent } from './suivi-hse-goals.component';

describe('SuiviHseGoalsComponent', () => {
  let component: SuiviHseGoalsComponent;
  let fixture: ComponentFixture<SuiviHseGoalsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SuiviHseGoalsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SuiviHseGoalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
