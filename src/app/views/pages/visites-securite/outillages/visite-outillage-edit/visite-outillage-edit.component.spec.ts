import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VisiteOutillageEditComponent } from './visite-outillage-edit.component';

describe('VisiteOutillageEditComponent', () => {
  let component: VisiteOutillageEditComponent;
  let fixture: ComponentFixture<VisiteOutillageEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VisiteOutillageEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VisiteOutillageEditComponent);
    component = fixture.componentInstance;
    // fixture.markForCheck();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
