import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VisiteChantierDetailComponent } from './visite-chantier-detail.component';

describe('VisiteChantierDetailComponent', () => {
  let component: VisiteChantierDetailComponent;
  let fixture: ComponentFixture<VisiteChantierDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VisiteChantierDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VisiteChantierDetailComponent);
    component = fixture.componentInstance;
    // fixture.markForCheck();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
