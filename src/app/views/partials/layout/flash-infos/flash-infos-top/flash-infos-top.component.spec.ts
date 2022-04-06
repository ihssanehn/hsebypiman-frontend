import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FlashInfosTopComponent } from './flash-infos-top.component';

describe('FlashInfosTopComponent', () => {
  let component: FlashInfosTopComponent;
  let fixture: ComponentFixture<FlashInfosTopComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlashInfosTopComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlashInfosTopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
