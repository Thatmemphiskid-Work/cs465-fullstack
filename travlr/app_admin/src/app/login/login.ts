import { Component } from '@angular/core';
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

    this.authenticationService.login(
      user,
      this.credentials.password
    );

    setTimeout(() => {
      if (this.authenticationService.isLoggedIn()) {
        this.router.navigate(['']);
      } else {
        this.formError =
          'Login failed. Please check your email and password.';
      }
    }, 750);
  }
}
