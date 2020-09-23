import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RemonteeAddComponent } from './remontee-add.component';

describe('RemonteeAddComponent', () => {
  let component: RemonteeAddComponent;
  let fixture: ComponentFixture<RemonteeAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RemonteeAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RemonteeAddComponent);
    component = fixture.componentInstance;
    // fixture.markForCheck();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
