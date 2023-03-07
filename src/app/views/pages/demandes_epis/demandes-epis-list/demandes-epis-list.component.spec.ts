import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DemandesEpisListComponent } from './demandes-epis-list.component';

describe('DemandesEpisListComponent', () => {
  let component: DemandesEpisListComponent;
  let fixture: ComponentFixture<DemandesEpisListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DemandesEpisListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DemandesEpisListComponent);
    component = fixture.componentInstance;
    // fixture.markForCheck();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
