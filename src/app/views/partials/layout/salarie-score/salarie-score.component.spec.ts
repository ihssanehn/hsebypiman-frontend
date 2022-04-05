import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SalarieScoreComponent } from './salarie-score.component';

describe('SalarieScoreComponent', () => {
  let component: SalarieScoreComponent;
  let fixture: ComponentFixture<SalarieScoreComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SalarieScoreComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SalarieScoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
