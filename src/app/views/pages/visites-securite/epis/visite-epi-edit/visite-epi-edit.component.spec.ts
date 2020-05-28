import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VisiteEpiEditComponent } from './visite-epi-edit.component';

describe('VisiteEpiEditComponent', () => {
  let component: VisiteEpiEditComponent;
  let fixture: ComponentFixture<VisiteEpiEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VisiteEpiEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VisiteEpiEditComponent);
    component = fixture.componentInstance;
    // fixture.markForCheck();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
