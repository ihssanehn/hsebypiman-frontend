import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadDelSignatureDocModalComponent } from './upload-del-signature-doc-modal.component';

describe('UploadDelSignatureDocModalComponent', () => {
  let component: UploadDelSignatureDocModalComponent;
  let fixture: ComponentFixture<UploadDelSignatureDocModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UploadDelSignatureDocModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadDelSignatureDocModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
