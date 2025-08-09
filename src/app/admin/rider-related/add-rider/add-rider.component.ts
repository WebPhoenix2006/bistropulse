import { Router } from '@angular/router';
import { Component, signal } from '@angular/core';
import { CustomersService } from '../../../shared/services/customers.service';

@Component({
  selector: 'app-add-rider',
  standalone: false,
  templateUrl: './add-rider.component.html',
  styleUrl: './add-rider.component.scss',
})
export class AddRiderComponent {
  imagePreview: string | ArrayBuffer | null = null;
  isLoading = signal<boolean>(false);
  isSuccessfull = signal<boolean>(false);
  formData: { [key: string]: any } = {
    gender: 'Male',
    isStudent: false,
    paymentMethod: 'Via Debit',
    attendance: '10:00 AM - 5:00 PM',
  };

  constructor(
    private router: Router,
    private customerService: CustomersService
  ) {}

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
    this.isLoading.set(true);
    const form = new FormData();
    const fieldMap: Record<string, string> = {
      fullName: 'name',
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

    console.log('Sending FormData:');
    for (const pair of form.entries()) {
      console.log(`${pair[0]}:`, pair[1]);
    }

    this.customerService.uploadCustomer(form).subscribe({
      next: (res) => {
        console.log('Uploaded!', res);
        this.isLoading.set(false);
        this.isSuccessfull.set(true);
        setTimeout(() => {
          this.router.navigateByUrl('/admin/customers');
        }, 2000);
      },
      error: (err) => {
        console.warn('Upload failed', err);
        this.isLoading.set(false);
      },
    });
  }

  removeImage(): void {
    this.imagePreview = null;
    this.formData['profileImage'] = null;
  }

  inputs = [
    {
      label: 'Name',
      type: 'text',
      formControlName: 'fullName',
      name: 'fullName',
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
