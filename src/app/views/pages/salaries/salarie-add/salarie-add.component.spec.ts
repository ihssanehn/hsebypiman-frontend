import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SalarieAddComponent } from './salarie-add.component';

describe('SalarieAddComponent', () => {
  let component: SalarieAddComponent;
  let fixture: ComponentFixture<SalarieAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SalarieAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SalarieAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
