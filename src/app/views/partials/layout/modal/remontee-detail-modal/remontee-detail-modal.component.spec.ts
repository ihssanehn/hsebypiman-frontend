import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RemonteeDetailModalComponent } from './remontee-detail-modal.component';

describe('RemonteeDetailModalComponent', () => {
  let component: RemonteeDetailModalComponent;
  let fixture: ComponentFixture<RemonteeDetailModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RemonteeDetailModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RemonteeDetailModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
