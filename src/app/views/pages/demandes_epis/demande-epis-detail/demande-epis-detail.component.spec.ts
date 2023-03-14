import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DemandeEpisDetailComponent } from './demande-epis-detail.component';

describe('DemandeEpisDetailComponent', () => {
  let component: DemandeEpisDetailComponent;
  let fixture: ComponentFixture<DemandeEpisDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DemandeEpisDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DemandeEpisDetailComponent);
    component = fixture.componentInstance;
    // fixture.markForCheck();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
