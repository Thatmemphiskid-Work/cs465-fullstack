import { Inject, Injectable } from '@angular/core';

import { BROWSER_STORAGE } from '../storage';
import { User } from '../models/user';
import { AuthResponse } from '../models/auth-response';
import { TripData } from './trip-data';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  authResp: AuthResponse = new AuthResponse();

  constructor(
    @Inject(BROWSER_STORAGE) private storage: Storage,
    private tripData: TripData
  ) {}

  public getToken(): string {
    const token = this.storage.getItem('travlr-token');

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
  }

  public logout(): void {
    this.storage.removeItem('travlr-token');
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

  public login(
    user: User,
    password: string
  ): void {
    this.tripData
      .login(user, password)
      .subscribe({
        next: (value: AuthResponse) => {
          this.authResp = value;
          this.saveToken(value.token);

          console.log(
            'Login successful'
          );
        },

        error: (error: any) => {
          console.error(
            'Login error:',
            error
          );
        }
      });
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
