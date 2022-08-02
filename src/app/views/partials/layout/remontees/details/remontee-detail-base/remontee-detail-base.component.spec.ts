import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RemonteeDetailBaseComponent } from './remontee-detail-base.component';

describe('RemonteeDetailBaseComponent', () => {
  let component: RemonteeDetailBaseComponent;
  let fixture: ComponentFixture<RemonteeDetailBaseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RemonteeDetailBaseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RemonteeDetailBaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
