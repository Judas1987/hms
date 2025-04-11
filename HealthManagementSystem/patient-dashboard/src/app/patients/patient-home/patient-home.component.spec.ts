import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PatientHomeComponent } from './patient-home.component';
import { PrescriptionService } from '../../prescriptions/service/prescription.service';
import { of } from 'rxjs';
import { AuthService } from '../../services/auth.service';

describe('PatientHomeComponent', () => {
  let component: PatientHomeComponent;
  let fixture: ComponentFixture<PatientHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PatientHomeComponent],
      providers: [
        {
          provide: PrescriptionService,
          useValue: {
            getAll: () =>
              of([
                {
                  medication: 'Ibuprofen',
                  dosage: '200mg',
                  frequency: '3x/day',
                },
              ]),
          },
        },
        {
          provide: AuthService,
          useValue: {
            getUserId: () => '4',
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PatientHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should load prescriptions for the patient', () => {
    expect(component).toBeTruthy();
    expect(component.prescriptions.length).toBe(1);
    expect(component.prescriptions[0].medication).toBe('Ibuprofen');
  });
});
