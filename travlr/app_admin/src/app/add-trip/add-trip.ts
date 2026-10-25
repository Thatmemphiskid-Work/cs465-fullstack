import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { Router } from '@angular/router';

import { TripData } from '../services/trip-data';

@Component({
  selector: 'app-add-trip',
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './add-trip.html',
  styleUrl: './add-trip.css'
})
export class AddTrip implements OnInit {
  public addForm!: FormGroup;
  submitted = false;
  message = '';

  constructor(
    private formBuilder: FormBuilder,
    private cdr: ChangeDetectorRef,
    public router: Router,
    private tripService: TripData
  ) {}

  ngOnInit(): void {
    this.addForm = this.formBuilder.group({
      code: ['', Validators.required],
      name: ['', Validators.required],
      length: ['', Validators.required],
      start: ['', Validators.required],
      resort: ['', Validators.required],
      perPerson: ['', Validators.required],
      image: ['', Validators.required],
      description: ['', Validators.required]
    });
  }

  public onSubmit(): void {
    this.submitted = true;

    if (this.addForm.valid) {
      this.tripService.addTrip(this.addForm.value).subscribe({
        next: (data: any) => {
          console.log('Trip added:', data);
          this.router.navigate(['']);
        },
        error: (error: any) => {
          console.error('Error adding trip:', error);
          this.message = 'Unable to save trip. Check your login and required fields.';
          this.cdr.markForCheck();
        }
      });
    }
  }

  get f() {
    return this.addForm.controls;
  }
}
