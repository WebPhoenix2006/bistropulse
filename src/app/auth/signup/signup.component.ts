import {
  Component,
  ElementRef,
  OnInit,
  signal,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../shared/services/auth.service';
import { Router } from '@angular/router';
import { SlowNetworkService } from '../../shared/services/slow-nerwork.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-signup',
  standalone: false,
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss',
})
export class SignupComponent implements OnInit {
  signupForm: FormGroup;
  isLoading = signal<boolean>(false);

  @ViewChild('passwordInput', { static: false }) passwordInput!: ElementRef;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private slowNetwork: SlowNetworkService,
    public toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.signupForm = this.fb.group({
      fullname: ['', Validators.required],
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      otp: ['', Validators.required], // ✅ Added OTP
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

    this.isLoading.set(true);
    const formData = this.signupForm.value;

    this.slowNetwork.start(() => {
      if (this.isLoading()) {
        this.toastr.warning(
          'Hmm... this is taking longer than usual. Please check your connection.',
          'Slow Network'
        );
      }
    });

    this.auth.signup(formData).subscribe({
      next: (res) => {
        if (res.token) {
          this.auth.saveToken(res.token);
        }
        if (res.user) {
          this.auth.saveUserData(res.user); // ✅ store role and other user info
        }

        this.toastr.success('Sign up successful!', 'Welcome');
        this.isLoading.set(false);
        this.slowNetwork.clear();
        this.router.navigate(['/auth/login']);
      },

      error: (err) => {
        console.error('Signup error:', err);
        this.toastr.error(
          'Signup failed',
          err.error?.otp || 'Check your OTP or try again.'
        );
        this.isLoading.set(false);
        this.slowNetwork.clear();
      },
    });

    console.log('Form submitted:', formData);
  }
}
