import { Routes } from '@angular/router';
import { authGuard } from './auth.guard';

export const routes: Routes = [
    {
        path:'register',
        loadComponent:()=>import("../app/pages/register/register.component").then((comp)=>comp.RegisterComponent)
    },
    {
        path:'chat',
        canActivate:[authGuard],
        loadComponent:()=>import("../app/pages/chat/chat.component").then((comp)=>comp.ChatComponent)
    },
    {
        path:'login',
        loadComponent:()=>import("../app/pages/login/login.component").then((comp)=>comp.LoginComponent)
    },{
        path:'',
        redirectTo:'chat',
        pathMatch:'full'
    }
];
