import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthenticationService } from './services/authentication';

export const authGuard: CanActivateFn = () => {
  const authentication = inject(AuthenticationService);
  return authentication.isLoggedIn()
    ? true
    : inject(Router).createUrlTree(['/login']);
};
