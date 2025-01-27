import { inject, Injectable } from '@angular/core';
import { ICurrentUser } from '../interface/current_user';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  http=inject(HttpClient)
  user:ICurrentUser|null = null;

  setCurrentUser(user:ICurrentUser){
    this.user=user  
  }
  logout(){
    this.user=null
  }
  isLoggedIn():boolean{
    return!!this.user
  }

  getAccessToken(){
    return this.user?.accessToken??null
  }

  updateUser(user:ICurrentUser){
    this.user={...user}
  }

  refresh(){
    return this.http.post('http://localhost:3000/auth/refresh',{},{withCredentials:true})
  }
  
}
