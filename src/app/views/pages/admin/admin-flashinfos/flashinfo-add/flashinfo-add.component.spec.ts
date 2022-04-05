import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FlashInfoAddComponent } from './flashinfo-add.component';

describe('FlashInfoAddComponent', () => {
  let component: FlashInfoAddComponent;
  let fixture: ComponentFixture<FlashInfoAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlashInfoAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlashInfoAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
