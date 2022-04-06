import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArEditComponent } from './ar-edit.component';

describe('ArEditComponent', () => {
  let component: ArEditComponent;
  let fixture: ComponentFixture<ArEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArEditComponent);
    component = fixture.componentInstance;
    // fixture.markForCheck();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
