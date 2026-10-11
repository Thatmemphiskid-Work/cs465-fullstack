import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Trip } from '../models/trip';

@Injectable({
  providedIn: 'root'
})
export class TripData {
  private apiBaseUrl = 'http' + '://localhost:3000/api';

  constructor(private http: HttpClient) {}

  getTrips(): Observable<Trip[]> {
    return this.http.get<Trip[]>(
      this.apiBaseUrl + '/trips'
    );
  }

  getTrip(tripCode: string): Observable<Trip> {
    return this.http.get<Trip>(
      this.apiBaseUrl + '/trips/' + tripCode
    );
  }

  addTrip(trip: Trip): Observable<Trip> {
    return this.http.post<Trip>(
      this.apiBaseUrl + '/trips',
      trip
    );
  }

  updateTrip(trip: Trip): Observable<Trip> {
    return this.http.put<Trip>(
      this.apiBaseUrl + '/trips/' + trip.code,
      trip
    );
  }
}
