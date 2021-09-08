import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PdpDetailComponent } from './pdp-detail.component';

describe('PdpDetailComponent', () => {
  let component: PdpDetailComponent;
  let fixture: ComponentFixture<PdpDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PdpDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PdpDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
