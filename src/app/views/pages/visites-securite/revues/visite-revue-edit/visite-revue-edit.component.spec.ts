import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VisiteRevueEditComponent } from './visite-revue-edit.component';

describe('VisiteRevueEditComponent', () => {
  let component: VisiteRevueEditComponent;
  let fixture: ComponentFixture<VisiteRevueEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VisiteRevueEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VisiteRevueEditComponent);
    component = fixture.componentInstance;
    // fixture.markForCheck();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
