import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

import { AuthenticationService } from '../services/authentication';

@Component({
  selector: 'app-navbar',
  imports: [
    CommonModule,
    RouterModule
  ],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class Navbar {
  constructor(
    private authenticationService: AuthenticationService,
    private router: Router
  ) {}

  public isLoggedIn(): boolean {
    return this.authenticationService.isLoggedIn();
  }

  public onLogout(): void {
    this.authenticationService.logout();
    this.router.navigate(['']);
  }
}
