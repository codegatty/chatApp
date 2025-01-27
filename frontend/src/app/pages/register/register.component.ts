import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import {
  ReactiveFormsModule,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  http = inject(HttpClient);
  registerForm = new FormGroup({
    email: new FormControl('', [Validators.required]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
    ]),
    avatarUrl: new FormControl<null | File>(null, [Validators.required]),
  });

  errorMessage: string | null = null;
  formErrorMessage: string | null = null;

  onSubmitFormData() {
    if (this.registerForm.valid) {
      const payload = new FormData();
      payload.append('email', this.registerForm.value.email as string);
      payload.append('password', this.registerForm.value.password as string);
      payload.append('avatar', this.registerForm.value.avatarUrl as File);

      this.http.post('http://localhost:3000/auth/signup', payload).subscribe({
        next: (response) => {
          console.log(response);
        },
        error: (error) => {
          this.formErrorMessage=error.error.message;
        },
      });
    } else this.formErrorMessage="Fill the Form completely"
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (input?.files?.length) {
      const file = input.files[0];

      // Validate file type and size
      if (file.type !== 'image/jpeg') {
        this.errorMessage = 'Only JPG images are allowed.';
        this.registerForm.patchValue({ avatarUrl: null });
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        // Limit size to 5MB
        this.errorMessage = 'File size must not exceed 5MB.';
        this.registerForm.patchValue({ avatarUrl: null });
        return;
      }

      this.errorMessage = null;

      this.registerForm.patchValue({ avatarUrl: file });
      this.registerForm.get('avatar')?.updateValueAndValidity();
    }
  }
}
