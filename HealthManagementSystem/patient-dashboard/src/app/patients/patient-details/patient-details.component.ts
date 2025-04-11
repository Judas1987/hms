import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { PatientService } from '../service/patient.service';
import { AppointmentService } from '../../appointments/service/appointment.service';
import { PrescriptionService } from '../../prescriptions/service/prescription.service';
import { FormsModule } from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';

@Component({
  selector: 'app-patient-details',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTabsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  templateUrl: './patient-details.component.html',
  styleUrls: ['./patient-details.component.scss'],
})
export class PatientDetailsComponent implements OnInit {
  patientId: string = '';
  patient: any;
  loading = true;
  editingAppointment: any = null;
  newAppointment = {
    doctor: '',
    date: '',
    time: '',
    status: 'Scheduled',
  };
  get isEditing(): boolean {
    return this.editingAppointment !== null;
  }

  newPrescription = {
    medication: '',
    dosage: '',
    frequency: '',
    date: '',
    prescribingDoctor: '',
  };

  editingPrescription: any = null;

  get isEditingPrescription(): boolean {
    return this.editingPrescription !== null;
  }

  constructor(
    private route: ActivatedRoute,
    private patientService: PatientService,
    private appointmentService: AppointmentService,
    private prescriptionService: PrescriptionService,
  ) {}

  ngOnInit(): void {
    this.patientId = this.route.snapshot.paramMap.get('id') ?? '';
    if (this.patientId) {
      this.patientService.getById(this.patientId).subscribe({
        next: (res) => (this.patient = res),
        error: (err) => console.error(err),
      });
    }
  }
  loadPatient(): void {
    this.loading = true;
    this.patientService.getById(this.patientId).subscribe({
      next: (res) => {
        this.patient = res;
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
      },
    });
  }

  editAppointment(appt: any): void {
    this.editingAppointment = { ...appt }; // copia para evitar mutación directa
    this.newAppointment = { ...this.editingAppointment }; // usa el mismo form
  }

  cancelEdit(): void {
    this.editingAppointment = null;
    this.newAppointment = {
      doctor: '',
      date: '',
      time: '',
      status: 'Scheduled',
    };
  }

  addAppointment(): void {
    const data = {
      ...this.newAppointment,
      patientId: this.patient.id,
    };

    if (this.isEditing) {
      this.appointmentService
        .update(this.editingAppointment.id, data)
        .subscribe({
          next: () => {
            this.cancelEdit();
            this.loadPatient();
          },
          error: (err) => console.error(err),
        });
    } else {
      this.appointmentService.create(data).subscribe({
        next: () => {
          this.loadPatient();
          this.newAppointment = {
            doctor: '',
            date: '',
            time: '',
            status: 'Scheduled',
          };
        },
        error: (err) => console.error(err),
      });
    }
  }
  editPrescription(p: any): void {
    this.editingPrescription = { ...p };
    this.newPrescription = { ...this.editingPrescription };
  }

  cancelPrescriptionEdit(): void {
    this.editingPrescription = null;
    this.newPrescription = {
      medication: '',
      dosage: '',
      frequency: '',
      date: '',
      prescribingDoctor: '',
    };
  }

  addPrescription(): void {
    const data = {
      ...this.newPrescription,
      patientId: this.patient.id,
    };

    const req = this.isEditingPrescription
      ? this.prescriptionService.update(this.editingPrescription.id, data)
      : this.prescriptionService.create(data);

    req.subscribe({
      next: () => {
        this.cancelPrescriptionEdit();
        this.loadPatient(); // recarga recetas
      },
      error: (err) => console.error(err),
    });
  }

  exportAsPdf(): void {
    const doc = new jsPDF();
    const title = `Historial del Paciente: ${this.patient.name}`;
    doc.setFontSize(16);
    doc.text(title, 14, 15);

    // Patient details
    doc.setFontSize(12);
    doc.text(
      `Birth date: ${new Date(this.patient.dateOfBirth).toLocaleDateString()}`,
      14,
      25,
    );
    doc.text(`Gender: ${this.patient.gender}`, 14, 32);
    doc.text(`Contact: ${this.patient.contactInfo}`, 14, 39);
    doc.text(`Medical history: ${this.patient.medicalHistory}`, 14, 46);

    let currentY = 55;

    // Appointments
    doc.setFontSize(14);
    doc.text('Appointments', 14, currentY);
    currentY += 6;

    autoTable(doc, {
      startY: currentY,
      head: [['Date', 'Time', 'Doctor', 'Status']],
      body: this.patient.appointments.map((a: any) => [
        new Date(a.date).toLocaleDateString(),
        a.time,
        a.doctor,
        a.status,
      ]),
      theme: 'striped',
    });

    currentY = (doc as any).lastAutoTable.finalY + 10;

    // Receips
    doc.setFontSize(14);
    doc.text('Receips', 14, currentY);
    currentY += 6;

    autoTable(doc, {
      startY: currentY,
      head: [['Date', 'Medicine', 'Dose', 'Frequency', 'Doctor']],
      body: this.patient.prescriptions.map((r: any) => [
        new Date(r.date).toLocaleDateString(),
        r.medication,
        r.dosage,
        r.frequency,
        r.prescribingDoctor,
      ]),
      theme: 'striped',
    });

    doc.save(`Patient-${this.patient.name}.pdf`);
  }

  exportAsExcel(): void {
    const wb: XLSX.WorkBook = XLSX.utils.book_new();

    // Patient details as unic row
    const patientSheetData = [
      ['Name', 'Birth Date', 'Gender', 'Contact', 'Medical history'],
      [
        this.patient.name,
        this.patient.dateOfBirth,
        this.patient.gender,
        this.patient.contactInfo,
        this.patient.medicalHistory,
      ],
    ];
    const patientSheet = XLSX.utils.aoa_to_sheet(patientSheetData);
    XLSX.utils.book_append_sheet(wb, patientSheet, 'Pacient Data');

    // Appointments
    const appointments = this.patient.appointments.map((a: any) => ({
      Fecha: new Date(a.date).toLocaleDateString(),
      Hora: a.time,
      Doctor: a.doctor,
      Estado: a.status,
    }));
    const appointmentSheet = XLSX.utils.json_to_sheet(appointments);
    XLSX.utils.book_append_sheet(wb, appointmentSheet, 'Appointments');

    // Receips
    const prescriptions = this.patient.prescriptions.map((r: any) => ({
      Fecha: new Date(r.date).toLocaleDateString(),
      Medicamento: r.medication,
      Dosis: r.dosage,
      Frecuencia: r.frequency,
      Doctor: r.prescribingDoctor,
    }));
    const prescriptionSheet = XLSX.utils.json_to_sheet(prescriptions);
    XLSX.utils.book_append_sheet(wb, prescriptionSheet, 'Receips');

    const excelBuffer: any = XLSX.write(wb, {
      bookType: 'xlsx',
      type: 'array',
    });
    const blobData = new Blob([excelBuffer], {
      type: 'application/octet-stream',
    });
    FileSaver.saveAs(blobData, `Pacient-${this.patient.name}.xlsx`);
  }
}
