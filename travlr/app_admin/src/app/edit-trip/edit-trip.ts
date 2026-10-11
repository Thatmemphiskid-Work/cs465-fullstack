import {
  Component,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';

import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { Router } from '@angular/router';

import { TripData } from '../services/trip-data';
import { Trip } from '../models/trip';

@Component({
  selector: 'app-edit-trip',
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './edit-trip.html',
  styleUrl: './edit-trip.css'
})
export class EditTrip implements OnInit {
  public editForm!: FormGroup;
  trip!: Trip;
  submitted = false;
  message = '';

  constructor(
    private formBuilder: FormBuilder,
    public router: Router,
    private tripData: TripData,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const tripCode = localStorage.getItem('tripCode');

    if (!tripCode) {
      alert('Unable to determine which trip to edit.');
      this.router.navigate(['']);
      return;
    }

    this.editForm = this.formBuilder.group({
      code: [tripCode, Validators.required],
      name: ['', Validators.required],
      length: ['', Validators.required],
      start: ['', Validators.required],
      resort: ['', Validators.required],
      perPerson: ['', Validators.required],
      image: ['', Validators.required],
      description: ['', Validators.required]
    });

    this.tripData.getTrip(tripCode).subscribe({
      next: (value: Trip) => {
        this.trip = value;

        const formValue = {
          ...value,
          start: value.start
            ? value.start.substring(0, 10)
            : ''
        };

        this.editForm.patchValue(formValue);

        this.message = 'Trip ' + tripCode + ' retrieved.';
        this.cdr.markForCheck();
      },

      error: (error: any) => {
        console.error('Error retrieving trip:', error);
        this.message = 'Unable to retrieve trip.';
        this.cdr.markForCheck();
      }
    });
  }

  public onSubmit(): void {
    this.submitted = true;

    if (this.editForm.valid) {
      this.tripData.updateTrip(this.editForm.value).subscribe({
        next: (value: Trip) => {
          console.log('Trip updated:', value);
          this.router.navigate(['']);
        },

        error: (error: any) => {
          console.error('Error updating trip:', error);
        }
      });
    }
  }

  get f() {
    return this.editForm.controls;
  }
}
