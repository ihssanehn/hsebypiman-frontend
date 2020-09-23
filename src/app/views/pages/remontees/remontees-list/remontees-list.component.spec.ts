import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RemonteesListComponent } from './remontees-list.component';

describe('RemonteesListComponent', () => {
  let component: RemonteesListComponent;
  let fixture: ComponentFixture<RemonteesListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RemonteesListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RemonteesListComponent);
    component = fixture.componentInstance;
    // fixture.markForCheck();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
