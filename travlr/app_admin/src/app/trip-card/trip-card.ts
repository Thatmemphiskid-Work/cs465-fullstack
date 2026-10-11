import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { Trip } from '../models/trip';

@Component({
  selector: 'app-trip-card',
  imports: [CommonModule],
  templateUrl: './trip-card.html',
  styleUrl: './trip-card.css'
})
export class TripCard {
  @Input() trip!: Trip;

  constructor(private router: Router) {}

  public editTrip(trip: Trip): void {
    localStorage.setItem('tripCode', trip.code);
    this.router.navigate(['/edit-trip']);
  }
}
