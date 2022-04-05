import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterielAddComponent } from './materiel-add.component';

describe('MaterielAddComponent', () => {
  let component: MaterielAddComponent;
  let fixture: ComponentFixture<MaterielAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MaterielAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MaterielAddComponent);
    component = fixture.componentInstance;
    // fixture.markForCheck();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
