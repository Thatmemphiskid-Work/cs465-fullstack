import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthenticationService } from '../services/authentication';
import { User } from '../models/user';

@Component({
  selector: 'app-login',
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  public formError = '';

  credentials = {
    email: '',
    password: ''
  };

  constructor(
    private router: Router,
    private cdr: ChangeDetectorRef,
    private authenticationService: AuthenticationService
  ) {}

  public onLoginSubmit(): void {
    this.formError = '';

    if (
      !this.credentials.email ||
      !this.credentials.password
    ) {
      this.formError =
        'Email and password are required.';
      return;
    }

    const user = {
      name: '',
      email: this.credentials.email
    } as User;

    this.authenticationService.login(user, this.credentials.password).subscribe({
      next: () => this.router.navigate(['']),
      error: () => {
        this.formError = 'Login failed. Please check your email and password.';
        this.cdr.markForCheck();
      }
    });
  }
}
