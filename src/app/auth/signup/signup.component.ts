import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../shared/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  standalone: false,
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss',
})
export class SignupComponent implements OnInit {
  signupForm: FormGroup;

  @ViewChild('passwordInput', { static: false }) passwordInput!: ElementRef;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.signupForm = this.fb.group({
      fullname: ['', Validators.required],
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  showPass(event: Event) {
    const checkbox = event.target as HTMLInputElement;

    if (this.passwordInput) {
      this.passwordInput.nativeElement.type = checkbox.checked
        ? 'text'
        : 'password';
    }
  }

  onSubmit() {
    if (this.signupForm.invalid) {
      this.signupForm.markAllAsTouched();
      return;
    }

    const formData = this.signupForm.value;

    this.auth.signup(formData).subscribe({
      next: (res) => {
        // Optional: save token if returned
        // this.auth.saveToken(res.token);
        alert('Sign up successful');
        this.router.navigate(['/auth/login']);
      },
      error: (err) => {
        console.error('Signup error:', err);
      },
    });

    console.log('Form submitted:', formData);
  }
}
