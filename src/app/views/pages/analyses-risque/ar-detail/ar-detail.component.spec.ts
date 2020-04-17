import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArDetailComponent } from './ar-detail.component';

describe('ArDetailComponent', () => {
  let component: ArDetailComponent;
  let fixture: ComponentFixture<ArDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
