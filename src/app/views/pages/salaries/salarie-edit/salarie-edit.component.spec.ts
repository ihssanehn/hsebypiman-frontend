import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SalarieEditComponent } from './salarie-edit.component';

describe('SalarieEditComponent', () => {
  let component: SalarieEditComponent;
  let fixture: ComponentFixture<SalarieEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SalarieEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SalarieEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
