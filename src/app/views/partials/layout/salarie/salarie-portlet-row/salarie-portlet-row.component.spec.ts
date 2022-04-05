import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SalariePortletRowComponent } from './salarie-portlet-row.component';

describe('SalariePortletRowComponent', () => {
  let component: SalariePortletRowComponent;
  let fixture: ComponentFixture<SalariePortletRowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SalariePortletRowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SalariePortletRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
