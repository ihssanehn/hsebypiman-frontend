import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FlashinfoReaderComponent } from './flashinfo-reader.component';

describe('FlashinfoReaderComponent', () => {
  let component: FlashinfoReaderComponent;
  let fixture: ComponentFixture<FlashinfoReaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlashinfoReaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlashinfoReaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
