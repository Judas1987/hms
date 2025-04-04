import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PatientDetailsComponent } from './patient-details.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { PatientService } from '../service/patient.service';
import { AppointmentService } from '../../appointments/service/appointment.service';
import { PrescriptionService } from '../../prescriptions/service/prescription.service';
import { provideHttpClient } from '@angular/common/http';

describe('PatientDetailsComponent', () => {
  let component: PatientDetailsComponent;
  let fixture: ComponentFixture<PatientDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, PatientDetailsComponent],
      providers: [
        provideHttpClient(),
        PatientService,
        AppointmentService,
        PrescriptionService,
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: convertToParamMap({ id: '1' }),
            },
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PatientDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
