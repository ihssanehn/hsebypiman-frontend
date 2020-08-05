import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SalarieDetailComponent } from './salarie-detail.component';

describe('SalarieDetailComponent', () => {
  let component: SalarieDetailComponent;
  let fixture: ComponentFixture<SalarieDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SalarieDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SalarieDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
