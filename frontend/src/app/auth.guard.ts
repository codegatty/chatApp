import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './services/auth.service';
import { ICurrentUser } from './interface/current_user';
import { of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  console.log("Interfered by Guard");

  return authService.refresh().pipe(
    switchMap((user) => {
      authService.setCurrentUser(user as ICurrentUser);
      return of(true); // Allow navigation
    }),
    catchError(() => {
      router.navigate(['/login']);
      return of(false); // Block navigation
    })
  );
};
