import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowDocumentContentDialogComponent } from './show-document-content-dialog.component';

describe('ShowDocumentContentDialogComponent', () => {
  let component: ShowDocumentContentDialogComponent;
  let fixture: ComponentFixture<ShowDocumentContentDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShowDocumentContentDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowDocumentContentDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
