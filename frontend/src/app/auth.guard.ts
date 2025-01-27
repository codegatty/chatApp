import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './services/auth.service';

export const authGuard: CanActivateFn =async (route, state) => {
  const authService=inject(AuthService)
  const router=inject(Router)
console.log("interfiered by Guard")
  if(authService.getAccessToken()){
  return true;
  
  }else{
    // const a= authService.refresh()
   router.navigate(['/login'])
    return false
  }
};
