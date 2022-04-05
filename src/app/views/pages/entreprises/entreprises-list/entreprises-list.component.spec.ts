import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EntreprisesListComponent } from './entreprises-list.component';

describe('EntreprisesListComponent', () => {
  let component: EntreprisesListComponent;
  let fixture: ComponentFixture<EntreprisesListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EntreprisesListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EntreprisesListComponent);
    component = fixture.componentInstance;
    // fixture.markForCheck();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
