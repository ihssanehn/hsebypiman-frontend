import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PdpAddClientComponent } from './pdp-add-client.component';

describe('PdpAddClientComponent', () => {
  let component: PdpAddClientComponent;
  let fixture: ComponentFixture<PdpAddClientComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PdpAddClientComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PdpAddClientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
