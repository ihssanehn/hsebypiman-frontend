import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArDetailPanelsComponent } from './ar-detail-panels.component';

describe('ArDetailPanelsComponent', () => {
  let component: ArDetailPanelsComponent;
  let fixture: ComponentFixture<ArDetailPanelsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArDetailPanelsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArDetailPanelsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
