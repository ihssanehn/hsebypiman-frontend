import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChantiersListComponent } from './chantiers-list.component';

describe('ChantiersListComponent', () => {
  let component: ChantiersListComponent;
  let fixture: ComponentFixture<ChantiersListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChantiersListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChantiersListComponent);
    component = fixture.componentInstance;
    // fixture.markForCheck();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
