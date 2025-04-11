import { TestBed } from '@angular/core/testing';
import { PatientListComponent } from './patient-list.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { PatientService } from '../service/patient.service';

describe('PatientListComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, PatientListComponent],
      providers: [PatientService],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(PatientListComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});
