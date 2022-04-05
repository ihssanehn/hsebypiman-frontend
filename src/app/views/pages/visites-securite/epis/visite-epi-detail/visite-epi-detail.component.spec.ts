import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VisiteEpiDetailComponent } from './visite-epi-detail.component';

describe('VisiteEpiDetailComponent', () => {
  let component: VisiteEpiDetailComponent;
  let fixture: ComponentFixture<VisiteEpiDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VisiteEpiDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VisiteEpiDetailComponent);
    component = fixture.componentInstance;
    // fixture.markForCheck();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
