import { Component, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../shared/services/auth.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { SlowNetworkService } from '../../shared/services/slow-nerwork.service';

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
    public toastr: ToastrService,
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
        this.toastr.warning(
          'Hmm... this is taking longer than usual. Please check your connection.',
          'Slow Network'
        );
      }
    });

    this.auth.login(loginData).subscribe({
      next: (res) => {
        this.auth.saveToken(res.token);
        this.isLoading.set(false);
        this.slowNetwork.clear();
        this.toastr.success('Success!', 'Login Successfull');
        this.router.navigate(['/admin/dashboard']);
      },
      error: (err) => {
        // console.error('Login error:', err);
        this.isLoading.set(false);
        this.slowNetwork.clear();
        this.toastr.error('Error', err.error?.message || 'Unknown Error');
      },
    });
  }
}
