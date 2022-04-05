import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SalariePortletComponent } from './salarie-portlet.component';

describe('SalariePortletComponent', () => {
  let component: SalariePortletComponent;
  let fixture: ComponentFixture<SalariePortletComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SalariePortletComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SalariePortletComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
