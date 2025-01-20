import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

export const authGuard: CanActivateFn = (route, state) => {

  if(inject(AuthService).isLoggedIn){
   
  return true;
  }else{
    
    inject(Router).navigate(['/login'])
    return false
  }
};
