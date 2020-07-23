import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SalarieDashComponent } from './salarie-dash.component';

describe('SalarieDashComponent', () => {
  let component: SalarieDashComponent;
  let fixture: ComponentFixture<SalarieDashComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SalarieDashComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SalarieDashComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
