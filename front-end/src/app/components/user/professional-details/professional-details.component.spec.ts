import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfessionalDetailsComponent } from './professional-details.component';

describe('ProfessionalDetailsComponent', () => {
  let component: ProfessionalDetailsComponent;
  let fixture: ComponentFixture<ProfessionalDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfessionalDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfessionalDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
