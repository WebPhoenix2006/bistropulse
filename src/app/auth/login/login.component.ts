import { Component, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../shared/services/auth.service';
import { Router } from '@angular/router';

import { SlowNetworkService } from '../../shared/services/slow-nerwork.service';
import { BootstrapToastService } from '../../shared/services/bootstrap-toast.service';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  passwordVisible = signal<boolean>(false); // ✅ reactive signal for show/hide password
  isLoading = signal<boolean>(false);

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    public toastr: BootstrapToastService,
    private slowNetwork: SlowNetworkService
  ) {}

  ngOnInit(): void {
    if (this.auth.isLoggedIn()) {
      this.router.navigate(['/admin/dashboard']);
    }

    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  togglePasswordVisibility() {
    this.passwordVisible.set(!this.passwordVisible());
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    const loginData = this.loginForm.value;

    this.slowNetwork.start(() => {
      if (this.isLoading()) {
        this.toastr.showWarning(
          'Hmm... this is taking longer than usual. Please check your connection.'
        );
      }
    });

    this.auth.login(loginData).subscribe({
      next: (res) => {
        this.auth.saveToken(res.token);
        this.isLoading.set(false);
        this.slowNetwork.clear();
        this.toastr.showSuccess('Success!, Login successful!');
        this.router.navigate(['/admin/dashboard']);
      },
      error: (err) => {
        // console.error('Login error:', err);
        this.isLoading.set(false);
        this.slowNetwork.clear();
        this.toastr.showError('Error', err.error?.message || 'Unknown Error');
      },
    });
  }
}
