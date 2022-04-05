import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArFormComponent } from './ar-form.component';

describe('ArFormComponent', () => {
  let component: ArFormComponent;
  let fixture: ComponentFixture<ArFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
