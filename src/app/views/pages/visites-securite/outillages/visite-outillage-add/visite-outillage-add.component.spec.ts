import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VisiteOutillageAddComponent } from './visite-outillage-add.component';

describe('VisiteOutillageAddComponent', () => {
  let component: VisiteOutillageAddComponent;
  let fixture: ComponentFixture<VisiteOutillageAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VisiteOutillageAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VisiteOutillageAddComponent);
    component = fixture.componentInstance;
    // fixture.markForCheck();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
