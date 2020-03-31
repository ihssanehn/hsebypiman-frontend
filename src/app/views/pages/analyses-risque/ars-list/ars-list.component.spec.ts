import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArsListComponent } from './ars-list.component';

describe('ArsListComponent', () => {
  let component: ArsListComponent;
  let fixture: ComponentFixture<ArsListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArsListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArsListComponent);
    component = fixture.componentInstance;
    // fixture.markForCheck();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
