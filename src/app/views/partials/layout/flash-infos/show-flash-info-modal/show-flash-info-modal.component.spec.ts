import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowFlashInfoModalComponent } from './show-flash-info-modal.component';

describe('ShowFlashInfoModalComponent', () => {
  let component: ShowFlashInfoModalComponent;
  let fixture: ComponentFixture<ShowFlashInfoModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShowFlashInfoModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowFlashInfoModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
