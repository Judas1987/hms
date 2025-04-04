import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PatientService } from '../service/patient.service';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatCard} from '@angular/material/card';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-patient-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatPaginatorModule,
    MatButtonModule,
    MatProgressSpinner,
    MatIcon,
    MatCard
  ],
  templateUrl: './patient-list.component.html',
  styleUrls: ['./patient-list.component.scss']
})
export class PatientListComponent implements OnInit {
  
  totalPatients = 0;
  currentPage = 1;
  pageSize = 10;
  patients: any[] = [];
  displayedColumns = ['name', 'dateOfBirth', 'gender', 'contactInfo'];
  nameFilter: string = '';

  loading = false;
  error = '';
  constructor(private patientService: PatientService) {}

  ngOnInit(): void {
    this.loadPatients();
  }

  loadPatients(force: boolean = false): void {
    this.loading = true;
    this.error = '';
  
    this.patientService.getAll(this.nameFilter, this.currentPage, this.pageSize, force).subscribe({
      next: (res) => {
        this.patients = res.items;
        this.totalPatients = res.totalCount;
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.error = 'Failed to load patients. Please try again.';
        this.loading = false;
      },
    });
  }
  
  refresh() {
    this.loadPatients(true); // fuerza recarga ignorando caché
  }
  onSearch(): void {
    this.currentPage = 1;
    this.loadPatients();
  }
  
  onPageChange(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.loadPatients();
  }
}
