import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VisiteChantierAddComponent } from './visite-chantier-add.component';

describe('VisiteChantierAddComponent', () => {
  let component: VisiteChantierAddComponent;
  let fixture: ComponentFixture<VisiteChantierAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VisiteChantierAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VisiteChantierAddComponent);
    component = fixture.componentInstance;
    // fixture.markForCheck();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
