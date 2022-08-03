import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DocListTooltipComponent } from './doc-list-tooltip.component';

describe('DocListTooltipComponent', () => {
  let component: DocListTooltipComponent;
  let fixture: ComponentFixture<DocListTooltipComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DocListTooltipComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocListTooltipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
