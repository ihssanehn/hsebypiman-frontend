import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VisiteChantierEditComponent } from './visite-chantier-edit.component';

describe('VisiteChantierEditComponent', () => {
  let component: VisiteChantierEditComponent;
  let fixture: ComponentFixture<VisiteChantierEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VisiteChantierEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VisiteChantierEditComponent);
    component = fixture.componentInstance;
    // fixture.markForCheck();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
