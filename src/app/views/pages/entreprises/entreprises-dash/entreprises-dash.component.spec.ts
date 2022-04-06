import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EntreprisesDashComponent } from './entreprises-dash.component';

describe('EntreprisesDashComponent', () => {
  let component: EntreprisesDashComponent;
  let fixture: ComponentFixture<EntreprisesDashComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EntreprisesDashComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EntreprisesDashComponent);
    component = fixture.componentInstance;
    // fixture.markForCheck();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
