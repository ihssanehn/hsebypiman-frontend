import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SalariePortletBoxComponent } from './salarie-portlet-box.component';

describe('SalariePortletBoxComponent', () => {
  let component: SalariePortletBoxComponent;
  let fixture: ComponentFixture<SalariePortletBoxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SalariePortletBoxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SalariePortletBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
