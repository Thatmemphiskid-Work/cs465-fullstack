import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Trip } from '../models/trip';
import { User } from '../models/user';
import { AuthResponse } from '../models/auth-response';
import { BROWSER_STORAGE } from '../storage';

@Injectable({
  providedIn: 'root'
})
export class TripData {
  private apiBaseUrl = 'http' + '://localhost:3000/api';

  constructor(
    private http: HttpClient,
    @Inject(BROWSER_STORAGE) private storage: Storage
  ) {}

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

  login(
    user: User,
    password: string
  ): Observable<AuthResponse> {
    return this.handleAuthAPICall(
      'login',
      user,
      password
    );
  }

  register(
    user: User,
    password: string
  ): Observable<AuthResponse> {
    return this.handleAuthAPICall(
      'register',
      user,
      password
    );
  }

  private handleAuthAPICall(
    endpoint: string,
    user: User,
    password: string
  ): Observable<AuthResponse> {
    const formData = {
      name: user.name,
      email: user.email,
      password: password
    };

    return this.http.post<AuthResponse>(
      this.apiBaseUrl + '/' + endpoint,
      formData
    );
  }
}
