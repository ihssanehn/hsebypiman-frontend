import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterielsDashComponent } from './materiels-dash.component';

describe('MaterielsDashComponent', () => {
  let component: MaterielsDashComponent;
  let fixture: ComponentFixture<MaterielsDashComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MaterielsDashComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MaterielsDashComponent);
    component = fixture.componentInstance;
    // fixture.markForCheck();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
