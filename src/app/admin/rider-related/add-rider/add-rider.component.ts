import { Router, ActivatedRoute } from '@angular/router';
import { Component, signal, OnInit, OnDestroy } from '@angular/core';
import { RiderService } from '../../../shared/services/rider.service';
import { RestaurantContextService } from '../../../shared/services/restaurant-context.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-add-rider',
  standalone: false,
  templateUrl: './add-rider.component.html',
  styleUrl: './add-rider.component.scss',
})
export class AddRiderComponent implements OnInit, OnDestroy {
  imagePreview: string | ArrayBuffer | null = null;
  isLoading = signal<boolean>(false);
  isSuccessfull = signal<boolean>(false);

  // Context variables
  restaurantId: string | null = null;
  franchiseId: string | null = null;
  branchId: string | null = null;
  contextType: 'restaurant' | 'branch' | null = null;

  private destroy$ = new Subject<void>();

  formData: { [key: string]: any } = {
    gender: 'Male',
    isStudent: false,
    paymentMethod: 'Via Debit',
    attendance: '10:00 AM - 5:00 PM',
  };

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private riderService: RiderService,
    private restaurantContext: RestaurantContextService
  ) {}

  ngOnInit(): void {
    // Extract IDs from route parameters
    this.extractRouteParameters();

    // Subscribe to route parameter changes
    this.route.params.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      this.extractRouteParameters();
    });

    // Also listen to context service changes
    this.restaurantContext.contextState$
      .pipe(takeUntil(this.destroy$))
      .subscribe((contextState) => {
        // Update context from service if route params are missing
        if (!this.restaurantId && !this.franchiseId && !this.branchId) {
          this.restaurantId = contextState.restaurantId;
          this.franchiseId = contextState.franchiseId;
          this.branchId = contextState.branchId;
          this.updateContextType();
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private extractRouteParameters(): void {
    // Get the full route snapshot including parent routes
    let currentRoute = this.route.snapshot;

    // Traverse up the route tree to get all parameters
    while (currentRoute) {
      const params = currentRoute.params;

      // Extract restaurant ID (from restaurant routes)
      if (params['id'] && !this.restaurantId) {
        this.restaurantId = params['id'];
      }

      // Extract franchise ID
      if (params['franchiseId'] && !this.franchiseId) {
        this.franchiseId = params['franchiseId'];
      }

      // Extract branch ID
      if (params['branchId'] && !this.branchId) {
        this.branchId = params['branchId'];
      }

      currentRoute = currentRoute.parent;
    }

    this.updateContextType();
    this.updateContextService();

    console.log('🔍 Extracted route parameters:', {
      restaurantId: this.restaurantId,
      franchiseId: this.franchiseId,
      branchId: this.branchId,
      contextType: this.contextType,
    });
  }

  private updateContextType(): void {
    if (this.branchId && this.franchiseId) {
      this.contextType = 'branch';
    } else if (this.restaurantId) {
      this.contextType = 'restaurant';
    } else {
      this.contextType = null;
    }
  }

  private updateContextService(): void {
    // Update the context service with the extracted parameters
    if (this.branchId && this.franchiseId) {
      this.restaurantContext.setBranchId(this.branchId, this.franchiseId);
    } else if (this.franchiseId) {
      this.restaurantContext.setFranchiseId(this.franchiseId);
    } else if (this.restaurantId) {
      this.restaurantContext.setRestaurantId(this.restaurantId);
    }
  }

  onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
      };
      reader.readAsDataURL(file);
      this.formData['profileImage'] = file;
    }
  }

  onFileChange(event: Event, name: string) {
    const file = (event.target as HTMLInputElement)?.files?.[0];
    if (file) {
      this.formData[name] = file;
    }
  }

  onSubmit(): void {
    // Validate that we have the required context
    if (!this.restaurantId && !this.branchId) {
      console.error('❌ No restaurant or branch context found');
      alert(
        'Error: No restaurant or branch context found. Please navigate from a restaurant or branch page.'
      );
      return;
    }

    this.isLoading.set(true);
    const form = new FormData();

    const fieldMap: Record<string, string> = {
      full_name: 'full_name',
      emailAddress: 'email',
      phoneNumber: 'phone',
      profileImage: 'photo',
      dateOfBirth: 'date_of_birth',
      birthPlace: 'birth_place',
      birthCertificate: 'birth_certificate',
      nidCard: 'nid_card',
      address: 'address',
      isStudent: 'is_student',
      gender: 'gender',
      location: 'location',
      paymentMethod: 'payment_method',
      attendance: 'attendance',
    };

    // Add form data
    for (const key in this.formData) {
      if (this.formData.hasOwnProperty(key)) {
        const mappedKey = fieldMap[key] || key;
        const value = this.formData[key];
        if (value instanceof File) {
          form.append(mappedKey, value);
        } else if (typeof value === 'boolean') {
          form.append(mappedKey, value ? 'true' : 'false');
        } else if (value !== null && value !== undefined) {
          form.append(mappedKey, value);
        }
      }
    }

    console.log('📤 Sending FormData:');
    for (const pair of form.entries()) {
      console.log(`${pair[0]}:`, pair[1]);
    }

    this.riderService.uploadRiders(form, this.restaurantId).subscribe({
      next: (res) => {
        console.log('✅ Rider uploaded successfully!', res);
        this.isLoading.set(false);
        this.isSuccessfull.set(true);

        setTimeout(() => {
          // Navigate back to the appropriate riders list
          this.navigateToRidersList();
        }, 2000);
      },
      error: (err) => {
        console.error(
          '❌ Upload failed:',
          err.status,
          err.error?.message || err.message
        );
        this.isLoading.set(false);

        // Show user-friendly error message
        if (err.status === 400 && err.error?.message) {
          alert(`Upload failed: ${err.error.message}`);
        } else {
          alert('Upload failed. Please check your data and try again.');
        }
      },
    });
  }

  private navigateToRidersList(): void {
    if (this.contextType === 'restaurant' && this.restaurantId) {
      this.router.navigateByUrl(
        `/admin/restaurants/${this.restaurantId}/riders`
      );
    } else if (
      this.contextType === 'branch' &&
      this.franchiseId &&
      this.branchId
    ) {
      this.router.navigateByUrl(
        `/admin/franchises/${this.franchiseId}/branches/${this.branchId}/riders`
      );
    } else {
      // Fallback to dashboard
      this.router.navigateByUrl('/admin/dashboard');
    }
  }

  removeImage(): void {
    this.imagePreview = null;
    this.formData['profileImage'] = null;
  }

  // Helper method to get context display text
  getContextDisplayText(): string {
    if (this.contextType === 'restaurant' && this.restaurantId) {
      return `Restaurant: ${this.restaurantId}`;
    } else if (
      this.contextType === 'branch' &&
      this.branchId &&
      this.franchiseId
    ) {
      return `Branch: ${this.branchId} (Franchise: ${this.franchiseId})`;
    }
    return 'No context';
  }

  inputs = [
    {
      label: 'Full name',
      type: 'text',
      formControlName: 'full_name',
      name: 'full_name',
      class: 'col-md-12',
    },
    {
      label: 'Email',
      type: 'text',
      formControlName: 'emailAddress',
      name: 'emailAddress',
      class: 'col-md-6',
    },
    {
      label: 'Phone Number',
      type: 'text',
      formControlName: 'phoneNumber',
      name: 'phoneNumber',
      class: 'col-md-6',
    },
    {
      label: 'Date of Birth',
      type: 'date',
      formControlName: 'dateOfBirth',
      name: 'dateOfBirth',
      class: 'col-md-6',
    },
    {
      label: 'Payment Method',
      type: 'select',
      formControlName: 'paymentMethod',
      name: 'paymentMethod',
      class: 'col-md-6',
      options: ['Via Debit', 'Via Credit', 'Cash', 'Bank Transfer'],
    },
    {
      label: 'Birth Place',
      type: 'text',
      formControlName: 'birthPlace',
      name: 'birthPlace',
      class: 'col-md-12',
    },
    {
      label: 'Birth Certificate',
      type: 'file',
      formControlName: 'birthCertificate',
      name: 'birthCertificate',
      class: 'col-md-6',
    },
    {
      label: 'NID Card',
      type: 'file',
      formControlName: 'nidCard',
      name: 'nidCard',
      class: 'col-md-6',
    },
    {
      label: 'Address',
      type: 'message',
      formControlName: 'address',
      name: 'address',
      class: 'col-md-12',
    },
    {
      label: 'Attendance',
      type: 'select',
      formControlName: 'attendance',
      name: 'attendance',
      class: 'col-md-12',
      options: [
        '10:00 AM - 5:00 PM',
        '9:00 AM - 6:00 PM',
        '8:00 AM - 4:00 PM',
        '11:00 AM - 7:00 PM',
        'Flexible Hours',
      ],
    },
  ];
}
