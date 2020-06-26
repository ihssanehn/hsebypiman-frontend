import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterielDetailComponent } from './materiel-detail.component';

describe('MaterielDetailComponent', () => {
  let component: MaterielDetailComponent;
  let fixture: ComponentFixture<MaterielDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MaterielDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MaterielDetailComponent);
    component = fixture.componentInstance;
    // fixture.markForCheck();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
