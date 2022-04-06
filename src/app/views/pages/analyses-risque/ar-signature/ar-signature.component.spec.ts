import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArSignatureComponent } from './ar-signature.component';

describe('ArSignatureComponent', () => {
  let component: ArSignatureComponent;
  let fixture: ComponentFixture<ArSignatureComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArSignatureComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArSignatureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
