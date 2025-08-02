import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BranchSubmit } from '../../../interfaces/branchsubmit.interface';
import { FranchisesService } from '../../../shared/services/franchises.service';
import { BootstrapToastService } from '../../../shared/services/bootstrap-toast.service';

@Component({
  selector: 'app-add-branch',
  standalone: false,
  templateUrl: './add-branch.component.html',
  styleUrl: './add-branch.component.scss',
})
export class AddBranchComponent implements OnInit {
  imagePreview: string | ArrayBuffer | null = null;
  formData: { [key: string]: any } = {};
  franchisesService = inject(FranchisesService);
  route = inject(ActivatedRoute);
  toastr = inject(BootstrapToastService);
  isLoading = signal<boolean>(false);
  isSuccessful = signal<boolean>(false);
  isDropdownOpen = signal<boolean>(false);

  franchiseId = signal<string>('');

  constructor(private router: Router) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('franchiseId');
    if (id) {
      this.franchiseId.set(id);
    } else {
      this.toastr.showError('Invalid franchise ID in URL');
      this.router.navigate(['/admin/franchises']);
    }
  }

  onFileChange(event: Event, name: string): void {
    const file = (event.target as HTMLInputElement)?.files?.[0];
    if (file) {
      this.formData[name] = file;

      // Show image preview if it's the branch image
      if (name === 'branchImage') {
        const reader = new FileReader();
        reader.onload = () => {
          this.imagePreview = reader.result;
        };
        reader.readAsDataURL(file);
      }
    }
  }

  removeRepImage(name: string): void {
    if (name === 'representativeImage') {
      this.repImagePreview = null;
      delete this.formData[name];
    }
  }

  removeImage(): void {
    this.imagePreview = null;
    delete this.formData['branchImage'];
  }

  onSubmit(): void {
    const franchiseId = this.franchiseId();

    if (!franchiseId) {
      this.toastr.showError('No franchise ID found');
      return;
    }

    this.isLoading.set(true);

    const formData = new FormData();

    formData.append('name', this.formData['branchName']);
    formData.append('phone', this.formData['phoneNumber']);
    formData.append('location', this.formData['location']);
    formData.append('business_license', this.formData['businessLicense']);
    formData.append('owner_nid', this.formData['ownerNID']);
    formData.append('established_date', this.formData['establishedDate']);
    formData.append('working_period', this.formData['workingPeriod']);
    formData.append('large_option', this.formData['largeOption']);
    formData.append('franchise', franchiseId); // string is fine here

    // Representative info — flattened
    formData.append(
      'representative.full_name',
      this.formData['representativeName']
    );
    formData.append(
      'representative.phone',
      this.formData['representativeNumber']
    );
    formData.append(
      'representative.location',
      this.formData['representativeLocation']
    );
    formData.append(
      'representative.profile_img',
      this.formData['representativeImage']
    );

    // ✅ representative ID must be sent if required by backend
    if (this.formData['representative']) {
      formData.append('representative', this.formData['representative']);
    }

    this.franchisesService.addBranch(franchiseId, formData).subscribe({
      next: (res) => {
        console.log('Branch created!', res);
        this.toastr.showSuccess('Branch created successfully!');
        this.isLoading.set(false);
        this.isSuccessful.set(true);
        setTimeout(() => {
          this.router.navigate(['/admin/franchises', franchiseId, 'branches']);
        }, 2000);
      },
      error: (err) => {
        console.warn('Branch creation failed', err);
        this.toastr.showError(err.message || 'Failed to create branch');
        this.isLoading.set(false);
      },
    });
  }

  // REP IMAGE PREVIEW LOGIC
  repImagePreview: string | null = null;

  onRepImageChange(event: any, name: string) {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (name === 'branchImage') {
        this.imagePreview = reader.result as string;
      } else if (name === 'representativeImage') {
        this.repImagePreview = reader.result as string;
      }

      this.formData[name] = file;
    };
    reader.readAsDataURL(file);
  }

  inputs = [
    {
      type: 'file',
      formControlName: 'branchImage',
      name: 'branchImage',
      class: 'col-md-12',
    },
    {
      label: 'Branch Name',
      type: 'text',
      formControlName: 'branchName',
      name: 'branchName',
      class: 'col-md-12',
    },
    {
      label: 'Phone Number',
      type: 'number',
      formControlName: 'phoneNumber',
      name: 'phoneNumber',
      class: 'col-md-12',
    },
    {
      label: 'Business License',
      type: 'file',
      formControlName: 'businessLicense',
      name: 'businessLicense',
      class: 'col-md-12',
    },
    {
      label: 'Owner NID',
      type: 'file',
      formControlName: 'ownerNID',
      name: 'ownerNID',
      class: 'col-md-12',
    },
    {
      label: 'Established',
      type: 'date',
      formControlName: 'establishedDate',
      name: 'establishedDate',
      class: 'col-md-4',
    },
    {
      label: 'Working Period',
      type: 'select',
      formControlName: 'workingPeriod',
      name: 'workingPeriod',
      class: 'col-md-4',
      options: [
        '6:00 AM – 2:00 PM',
        '9:00 AM – 5:00 PM',
        '10:00 AM – 6:00 PM',
        '12:00 PM – 8:00 PM',
        '4:00 PM – 12:00 AM',
        '24 Hours',
      ],
    },
    {
      label: 'Large',
      type: 'select',
      formControlName: 'largeOption',
      name: 'largeOption',
      class: 'col-md-4',
      options: ['Cash in hand', 'Online only', 'Mixed'],
    },
    {
      label: 'Location',
      type: 'message',
      formControlName: 'location',
      name: 'location',
      class: 'col-md-12',
    },
  ];

  representativeInputs = [
    {
      type: 'file',
      formControlName: 'representativeImage',
      name: 'representativeImage',
      class: 'col-md-12',
    },
    {
      type: 'text',
      name: 'representativeName',
      class: 'col-md-4',
      formControlName: 'representativeName',
      label: 'Representative Name',
    },
    {
      type: 'number',
      name: 'representativeNumber',
      class: 'col-md-4',
      formControlName: 'representativeNumber',
      label: 'Representative Number',
    },
    {
      type: 'text',
      name: 'representativeLocation',
      class: 'col-md-4',
      formControlName: 'representativeLocation',
      label: 'Representative Location',
    },
  ];
}
