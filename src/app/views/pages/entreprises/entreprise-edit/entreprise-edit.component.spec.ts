import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EntrepriseEditComponent } from './entreprise-edit.component';

describe('EntrepriseEditComponent', () => {
  let component: EntrepriseEditComponent;
  let fixture: ComponentFixture<EntrepriseEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EntrepriseEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EntrepriseEditComponent);
    component = fixture.componentInstance;
    // fixture.markForCheck();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
