import { inject, Injectable,NgZone} from '@angular/core';
import {SupabaseClient,createClient} from '@supabase/supabase-js'
import {environment} from './env/env.development'
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private supaBase?:SupabaseClient
  private router=inject(Router)
  private _ngZone: NgZone = inject(NgZone)

  constructor() { 
    this.supaBase = createClient(environment.supabaseUrl, environment.supabaseKey)
    this.supaBase.auth.onAuthStateChange((event,session)=>{
      localStorage.setItem('session',JSON.stringify(session?.user))
      if(session?.user){
        this._ngZone.run(()=>{
          this.router.navigate(['/chat'])
        })
      }
      
    })
    
  }
  get isLoggedIn():boolean{
    const user=localStorage.getItem('session')
    return user==='undefined'?false:true
  }
  async signInGoogle(){
    await this.supaBase?.auth.signInWithOAuth({
      provider:'google',

    })
  }

  async signOut(){
    await this.supaBase?.auth.signOut()
    this.router.navigate(['/login'])
    localStorage.removeItem('session')
  }
   
}
