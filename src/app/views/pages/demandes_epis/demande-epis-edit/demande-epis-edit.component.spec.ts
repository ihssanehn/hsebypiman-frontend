import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DemandeEpisEditComponent } from './demande-epis-edit.component';

describe('DemandeEpisEditComponent', () => {
  let component: DemandeEpisEditComponent;
  let fixture: ComponentFixture<DemandeEpisEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DemandeEpisEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DemandeEpisEditComponent);
    component = fixture.componentInstance;
    // fixture.markForCheck();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
