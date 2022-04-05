import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VisiteOutillageDetailComponent } from './visite-outillage-detail.component';

describe('VisiteOutillageDetailComponent', () => {
  let component: VisiteOutillageDetailComponent;
  let fixture: ComponentFixture<VisiteOutillageDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VisiteOutillageDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VisiteOutillageDetailComponent);
    component = fixture.componentInstance;
    // fixture.markForCheck();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
