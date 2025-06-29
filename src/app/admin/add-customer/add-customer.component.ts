import { Component, inject } from '@angular/core';
import { CustomersService } from '../../shared/services/customers.service';

@Component({
  selector: 'app-add-customer',
  standalone: false,
  templateUrl: './add-customer.component.html',
  styleUrl: './add-customer.component.scss',
})
export class AddCustomerComponent {
  imagePreview: string | ArrayBuffer | null = null;
  formData: { [key: string]: any } = {
    gender: 'Male',
    isStudent: false,
  };
  customerService = inject(CustomersService);

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

        // Boolean conversion for checkbox
        if (typeof this.formData[key] === 'boolean') {
          form.append(mappedKey, this.formData[key] ? 'true' : 'false');
        } else {
          form.append(mappedKey, this.formData[key]);
        }
      }
    }

    this.customerService.uploadCustomer(form).subscribe({
      next: (res) => console.log('Customer added!', res),
      error: (err) => console.warn('Upload failed', err),
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
      label: 'University student',
      type: 'checkbox',
      formControlName: 'isStudent',
      name: 'isStudent',
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
