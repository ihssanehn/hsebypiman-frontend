import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RemonteeDetailComponent } from './remontee-detail.component';

describe('RemonteeDetailComponent', () => {
  let component: RemonteeDetailComponent;
  let fixture: ComponentFixture<RemonteeDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RemonteeDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RemonteeDetailComponent);
    component = fixture.componentInstance;
    // fixture.markForCheck();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
