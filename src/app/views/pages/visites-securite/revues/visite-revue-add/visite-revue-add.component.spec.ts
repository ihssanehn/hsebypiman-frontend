import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VisiteRevueAddComponent } from './visite-revue-add.component';

describe('VisiteRevueAddComponent', () => {
  let component: VisiteRevueAddComponent;
  let fixture: ComponentFixture<VisiteRevueAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VisiteRevueAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VisiteRevueAddComponent);
    component = fixture.componentInstance;
    // fixture.markForCheck();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
