import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SendMailModalComponent } from './send-mail-modal.component';

describe('SendMailModalComponent', () => {
  let component: SendMailModalComponent;
  let fixture: ComponentFixture<SendMailModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SendMailModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SendMailModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
