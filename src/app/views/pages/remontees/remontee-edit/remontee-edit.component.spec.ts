import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RemonteeEditComponent } from './remontee-edit.component';

describe('RemonteeEditComponent', () => {
  let component: RemonteeEditComponent;
  let fixture: ComponentFixture<RemonteeEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RemonteeEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RemonteeEditComponent);
    component = fixture.componentInstance;
    // fixture.markForCheck();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
