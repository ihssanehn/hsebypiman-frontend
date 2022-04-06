import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FlashInfoDetailComponent } from './flashinfo-detail.component';

describe('FlashInfoDetailComponent', () => {
  let component: FlashInfoDetailComponent;
  let fixture: ComponentFixture<FlashInfoDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlashInfoDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlashInfoDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
