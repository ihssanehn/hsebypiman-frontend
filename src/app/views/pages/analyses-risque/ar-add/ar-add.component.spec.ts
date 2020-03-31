import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArAddComponent } from './ar-add.component';

describe('ArAddComponent', () => {
  let component: ArAddComponent;
  let fixture: ComponentFixture<ArAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArAddComponent);
    component = fixture.componentInstance;
    // fixture.markForCheck();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
