import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../shared/services/auth.service';
import { of } from 'rxjs';
import { delay, map, tap } from 'rxjs/operators';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return of(authService.isLoggedIn()).pipe(
    delay(0),
    tap((isLoggedIn) => {
      if (!isLoggedIn) {
        router.navigate(['/auth/login']);
      }
    }),
    map((isLoggedIn) => isLoggedIn)
  );
};
