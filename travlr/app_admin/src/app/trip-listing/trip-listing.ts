import {
  Component,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { Trip } from '../models/trip';
import { TripData } from '../services/trip-data';
import { TripCard } from '../trip-card/trip-card';

@Component({
  selector: 'app-trip-listing',
  imports: [
    CommonModule,
    TripCard
  ],
  providers: [
    TripData
  ],
  templateUrl: './trip-listing.html',
  styleUrl: './trip-listing.css'
})
export class TripListing implements OnInit {
  trips: Trip[] = [];
  message = '';

  constructor(
    private tripData: TripData,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  private getTrips(): void {
    this.tripData.getTrips().subscribe({
      next: (value: Trip[]) => {
        this.trips = value;

        if (value.length > 0) {
          this.message =
            `There are ${value.length} trips available.`;
        } else {
          this.message =
            'There were no trips retrieved from the database.';
        }

        this.cdr.markForCheck();
      },

      error: (error: any) => {
        console.error('Error retrieving trips:', error);
        this.message =
          'Unable to retrieve trips from the database.';
        this.cdr.markForCheck();
      }
    });
  }

  public addTrip(): void {
    this.router.navigate(['/add-trip']);
  }

  ngOnInit(): void {
    this.getTrips();
  }
}
