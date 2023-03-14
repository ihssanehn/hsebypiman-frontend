import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DemandeEpisAddComponent } from './demande-epis-add.component';

describe('DemandeEpisAddComponent', () => {
  let component: DemandeEpisAddComponent;
  let fixture: ComponentFixture<DemandeEpisAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DemandeEpisAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DemandeEpisAddComponent);
    component = fixture.componentInstance;
    // fixture.markForCheck();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
