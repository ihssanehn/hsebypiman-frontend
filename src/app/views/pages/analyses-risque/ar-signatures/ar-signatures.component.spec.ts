import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArSignaturesComponent } from './ar-signatures.component';

describe('ArSignaturesComponent', () => {
  let component: ArSignaturesComponent;
  let fixture: ComponentFixture<ArSignaturesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArSignaturesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArSignaturesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
