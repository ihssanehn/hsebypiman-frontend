import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VisiteRevueDetailComponent } from './visite-revue-detail.component';

describe('VisiteRevueDetailComponent', () => {
  let component: VisiteRevueDetailComponent;
  let fixture: ComponentFixture<VisiteRevueDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VisiteRevueDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VisiteRevueDetailComponent);
    component = fixture.componentInstance;
    // fixture.markForCheck();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
