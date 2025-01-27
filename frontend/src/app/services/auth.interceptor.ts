import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';
import { catchError, switchMap, throwError, of } from 'rxjs';
import { Router } from '@angular/router';
import { ICurrentUser } from '../interface/current_user';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const accessToken = authService.user?.accessToken;
  // Add Authorization header if the access token exists
  if (accessToken) {
    req = req.clone({
      withCredentials: true,
      setHeaders: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  }

  return next(req).pipe(
    catchError((err) => {
      if (err.status === 401) {

        // Avoid retrying the refresh request itself
        if (req.url.includes('/auth/refresh')) {
          authService.logout();
          console.log("refresh token expired");
          router.navigate(['/login']);
          return throwError(() => err); // Exit the flow
        }

        
        // Attempt to refresh the token
        return authService.refresh().pipe(
          switchMap((user) => {
            console.log(user)
            
            if (user as ICurrentUser) {
              authService.updateUser(user as ICurrentUser)
              console.log(authService.getAccessToken())
              req = req.clone({
                withCredentials: true,
                setHeaders: {
                  Authorization: `Bearer ${authService.getAccessToken()}`,
                },
              });
              return next(req);
            } else {
              authService.logout();
              router.navigate(['/login']);
              return throwError(() => err);
            }
          }),
          catchError((refreshErr) => {
            console.log("error in refreshing token", refreshErr);
            authService.logout();
            router.navigate(['/login']);
            return throwError(() => refreshErr);
          })
        );
      }

      console.log('Interceptor failed, request error:', err);
      return throwError(() => err); // Propagate non-401 errors
    })
  );
}