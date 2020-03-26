import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChantierAddComponent } from './chantier-add.component';

describe('ChantierAddComponent', () => {
  let component: ChantierAddComponent;
  let fixture: ComponentFixture<ChantierAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChantierAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChantierAddComponent);
    component = fixture.componentInstance;
    // fixture.markForCheck();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
