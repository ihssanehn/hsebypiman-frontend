import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VisiteQuestionOutillageAdminComponent } from './visite-question-outillage-admin.component';

describe('VisiteQuestionOutillageAdminComponent', () => {
  let component: VisiteQuestionOutillageAdminComponent;
  let fixture: ComponentFixture<VisiteQuestionOutillageAdminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VisiteQuestionOutillageAdminComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VisiteQuestionOutillageAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
