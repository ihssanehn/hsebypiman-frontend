import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDocModalComponent } from './add-doc-modal.component';

describe('AddDocModalComponent', () => {
  let component: AddDocModalComponent;
  let fixture: ComponentFixture<AddDocModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddDocModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddDocModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
