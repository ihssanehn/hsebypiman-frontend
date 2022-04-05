import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VisiteEpiAddComponent } from './visite-epi-add.component';

describe('VisiteEpiAddComponent', () => {
  let component: VisiteEpiAddComponent;
  let fixture: ComponentFixture<VisiteEpiAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VisiteEpiAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VisiteEpiAddComponent);
    component = fixture.componentInstance;
    // fixture.markForCheck();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
