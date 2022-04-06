import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FlashInfoEditComponent } from './flashinfo-edit.component';

describe('FlashInfoEditComponent', () => {
  let component: FlashInfoEditComponent;
  let fixture: ComponentFixture<FlashInfoEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlashInfoEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlashInfoEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
