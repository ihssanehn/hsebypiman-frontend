import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SalarieCardComponent } from './salarie-card.component';

describe('SalarieCardComponent', () => {
  let component: SalarieCardComponent;
  let fixture: ComponentFixture<SalarieCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SalarieCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SalarieCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
