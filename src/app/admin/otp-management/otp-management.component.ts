import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OtpService } from '../../shared/services/otp.service';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-otp',
  templateUrl: './otp-management.component.html',
  styleUrls: ['./otp-management.component.scss'],
  standalone: false,
})
export class OtpManagementComponent implements OnInit {
  otpForm: FormGroup;
  otps: any[] = [];
  loading = false;
  errorMsg: string = '';
  isBrowser: boolean;

  constructor(
    private fb: FormBuilder,
    private otpService: OtpService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId); // ✅ detect browser
    this.otpForm = this.fb.group({
      otp: ['', Validators.required],
      role: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    if (this.isBrowser) {
      this.loadOtps(); // ✅ only run in browser
    }
  }

  submitOtp() {
    if (this.otpForm.invalid) return;

    const { otp, role } = this.otpForm.value;
    this.loading = true;
    this.errorMsg = '';

    this.otpService.addOtp(otp, role).subscribe({
      next: (res) => {
        console.log('OTP created:', res);
        this.otpForm.reset();
        this.loadOtps(); // refresh list
      },
      error: (err) => {
        console.error('OTP creation failed:', err);
        this.errorMsg = err.error?.detail || 'Failed to create OTP';
      },
      complete: () => (this.loading = false),
    });
  }

  loadOtps() {
    this.loading = true;
    this.errorMsg = '';

    this.otpService.getOtps().subscribe({
      next: (res: any) => {
        console.log('OTP fetch result:', res);
        this.otps = res.results ?? res;
      },
      error: (err) => {
        console.error('Failed to load OTPs:', err);
        this.errorMsg = err.error?.detail || 'Could not fetch OTPs.';
      },
      complete: () => (this.loading = false),
    });
  }
}
