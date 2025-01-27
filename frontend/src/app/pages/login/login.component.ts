import { Component, inject } from '@angular/core';
import {
  ReactiveFormsModule,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  formErrorMessage = null;
  http = inject(HttpClient);
  authService = inject(AuthService);
  router = inject(Router);

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
  });

  onSubmitFormData() {
    if (this.loginForm.valid) {
      this.http
        .post('http://localhost:3000/auth/login', this.loginForm.value,{withCredentials:true})
        .subscribe({
          next: (res: any) => {
            const { password, message, ...rest } = res;
            this.authService.setCurrentUser(rest);
            this.router.navigate(['/chat']);
          },
          error: (err) => {
            console.log(err.error.message);
          },
        });
    } else {
      console.log('form is invalid');
    }
  }
}
