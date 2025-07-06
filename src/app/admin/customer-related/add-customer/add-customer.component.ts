import { Component, inject, signal } from '@angular/core';
import { CustomersService } from '../../../shared/services/customers.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-customer',
  standalone: false,
  templateUrl: './add-customer.component.html',
  styleUrl: './add-customer.component.scss',
})
export class AddCustomerComponent {
  imagePreview: string | ArrayBuffer | null = null;
  isLoading = signal<boolean>(false);
  isSuccessfull = signal<boolean>(false);
  formData: { [key: string]: any } = {
    gender: 'Male',
    isStudent: false,
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
      isStudent: 'is_student',
      gender: 'gender',
      location: 'location',
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
      label: 'Gender',
      type: 'select',
      formControlName: 'gender',
      name: 'gender',
      class: 'col-md-12',
      options: ['Male', 'Female'],
    },
    {
      label: 'Location',
      type: 'message',
      formControlName: 'location',
      name: 'location',
      class: 'col-md-12',
    },
  ];
}
