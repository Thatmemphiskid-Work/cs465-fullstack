import { Inject, Injectable, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';

import { BROWSER_STORAGE } from '../storage';
import { User } from '../models/user';
import { AuthResponse } from '../models/auth-response';
import { TripData } from './trip-data';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  authResp: AuthResponse = new AuthResponse();
  private token = signal('');

  constructor(
    @Inject(BROWSER_STORAGE) private storage: Storage,
    private tripData: TripData
  ) {
    this.token.set(this.storage.getItem('travlr-token') || '');
  }

  public getToken(): string {
    const token = this.token();

    if (!token) {
      return '';
    }

    return token;
  }

  public saveToken(token: string): void {
    this.storage.setItem(
      'travlr-token',
      token
    );
    this.token.set(token);
  }

  public logout(): void {
    this.storage.removeItem('travlr-token');
    this.token.set('');
  }

  public isLoggedIn(): boolean {
    const token = this.getToken();

    if (!token) {
      return false;
    }

    try {
      const payload = JSON.parse(
        atob(token.split('.')[1])
      );

      return payload.exp > (Date.now() / 1000);

    } catch {
      return false;
    }
  }

  public getCurrentUser(): User | null {
    if (!this.isLoggedIn()) {
      return null;
    }

    const token = this.getToken();

    try {
      const payload = JSON.parse(
        atob(token.split('.')[1])
      );

      return {
        email: payload.email,
        name: payload.name
      } as User;

    } catch {
      return null;
    }
  }

  public login(user: User, password: string): Observable<AuthResponse> {
    return this.tripData.login(user, password).pipe(
      tap(value => {
        this.authResp = value;
        this.saveToken(value.token);
      })
    );
  }

  public register(
    user: User,
    password: string
  ): void {
    this.tripData
      .register(user, password)
      .subscribe({
        next: (value: AuthResponse) => {
          this.authResp = value;
          this.saveToken(value.token);

          console.log(
            'Registration successful'
          );
        },

        error: (error: any) => {
          console.error(
            'Registration error:',
            error
          );
        }
      });
  }
}
