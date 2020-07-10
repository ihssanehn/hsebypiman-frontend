import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SalariesGoalsComponent } from './salaries-goals.component';

describe('SalariesGoalsComponent', () => {
  let component: SalariesGoalsComponent;
  let fixture: ComponentFixture<SalariesGoalsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SalariesGoalsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SalariesGoalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
