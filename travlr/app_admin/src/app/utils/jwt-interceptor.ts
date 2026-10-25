import { inject } from '@angular/core';
import {
  HttpInterceptorFn
} from '@angular/common/http';

import { AuthenticationService } from '../services/authentication';

export const jwtInterceptor: HttpInterceptorFn =
  (request, next) => {

    const authenticationService =
      inject(AuthenticationService);

    const isAuthAPI =
      request.url.endsWith('/login');

    if (
      authenticationService.isLoggedIn() &&
      !isAuthAPI
    ) {
      const token =
        authenticationService.getToken();

      const authRequest = request.clone({
        setHeaders: {
          Authorization:
            `Bearer ${token}`
        }
      });

      return next(authRequest);
    }

    return next(request);
  };
