import { TestBed } from '@angular/core/testing';
import { PatientDetailsComponent } from '../patients/patient-details/patient-details.component';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideAnimations } from '@angular/platform-browser/animations';
import { PatientService } from '../patients/service/patient.service';
import { ActivatedRoute, convertToParamMap } from '@angular/router';

describe('PatientDetailsComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClientTesting(),
        provideAnimations(), // Si usás Angular Material
        PatientService,
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: convertToParamMap({ id: '1' })
            }
          }
        }
      ],
    });
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(PatientDetailsComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});
