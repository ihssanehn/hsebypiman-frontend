import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageLightboxContentDialogComponent } from './image-lightbox-content-dialog.component';

describe('ImageLightboxContentDialogComponent', () => {
  let component: ImageLightboxContentDialogComponent;
  let fixture: ComponentFixture<ImageLightboxContentDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImageLightboxContentDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImageLightboxContentDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
