import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SignatureAddComponent } from './signature-add.component';

describe('SignatureAddComponent', () => {
  let component: SignatureAddComponent;
  let fixture: ComponentFixture<SignatureAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SignatureAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SignatureAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
