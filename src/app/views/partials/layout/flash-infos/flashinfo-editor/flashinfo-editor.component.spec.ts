import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FlashinfoEditorComponent } from './flashinfo-editor.component';

describe('FlashinfoEditorComponent', () => {
  let component: FlashinfoEditorComponent;
  let fixture: ComponentFixture<FlashinfoEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlashinfoEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlashinfoEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
