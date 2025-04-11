import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DoctorHomeComponent } from './doctor-home.component';
import { AppointmentService } from '../../appointments/service/appointment.service';
import { of } from 'rxjs';

describe('DoctorHomeComponent', () => {
  let component: DoctorHomeComponent;
  let fixture: ComponentFixture<DoctorHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DoctorHomeComponent],
      providers: [
        {
          provide: AppointmentService,
          useValue: {
            getByCurrentDoctor: () =>
              of([{ date: '2025-04-04T10:00:00', patientId: 1 }]),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DoctorHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should load doctor appointments', () => {
    expect(component).toBeTruthy();
    expect(component.appointments.length).toBe(1);
    expect(component.appointments[0].patientId).toBe(1);
  });
});
