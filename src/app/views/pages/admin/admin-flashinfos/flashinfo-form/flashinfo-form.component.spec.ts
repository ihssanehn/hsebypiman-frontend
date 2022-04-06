import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FlashInfoFormComponent } from './flashinfo-form.component';

describe('FlashInfoFormComponent', () => {
  let component: FlashInfoFormComponent;
  let fixture: ComponentFixture<FlashInfoFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlashInfoFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlashInfoFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
