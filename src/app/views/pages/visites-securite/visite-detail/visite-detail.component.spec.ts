import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VisiteDetailComponent } from './visite-detail.component';

describe('VisiteDetailComponent', () => {
  let component: VisiteDetailComponent;
  let fixture: ComponentFixture<VisiteDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VisiteDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VisiteDetailComponent);
    component = fixture.componentInstance;
    // fixture.markForCheck();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
