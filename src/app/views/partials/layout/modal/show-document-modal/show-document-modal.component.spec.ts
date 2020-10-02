import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowDocumentModalComponent } from './show-document-modal.component';

describe('ShowDocumentModalComponent', () => {
  let component: ShowDocumentModalComponent;
  let fixture: ComponentFixture<ShowDocumentModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShowDocumentModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowDocumentModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
