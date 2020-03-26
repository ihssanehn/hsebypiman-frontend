import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChantierEditComponent } from './chantier-edit.component';

describe('ChantierEditComponent', () => {
  let component: ChantierEditComponent;
  let fixture: ComponentFixture<ChantierEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChantierEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChantierEditComponent);
    component = fixture.componentInstance;
    // fixture.markForCheck();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
