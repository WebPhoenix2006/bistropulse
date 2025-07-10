import { Component, inject, signal } from '@angular/core';
import { RestaurantService } from '../../../shared/services/restaurant.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-restaurant',
  standalone: false,
  templateUrl: './add-restaurant.component.html',
  styleUrl: './add-restaurant.component.scss',
})
export class AddRestaurantComponent {
  imagePreview: string | ArrayBuffer | null = null;
  formData: { [key: string]: any } = {};
  restaurantService = inject(RestaurantService);
  isLoading = signal<boolean>(false);
  isSuccessfull = signal<boolean>(false);

  constructor(private router: Router) {}

  onFileChange(event: Event, name: string): void {
    const file = (event.target as HTMLInputElement)?.files?.[0];
    if (file) {
      this.formData[name] = file;

      // Show image preview if it's the restaurant image
      if (name === 'restaurantImage') {
        const reader = new FileReader();
        reader.onload = () => {
          this.imagePreview = reader.result;
        };
        reader.readAsDataURL(file);
      }
    }
  }

  removeImage(): void {
    this.imagePreview = null;
    delete this.formData['restaurantImage'];
  }

  onSubmit(): void {
    this.isLoading.set(true);
    const form = new FormData();

    const fieldMap: Record<string, string> = {
      restaurantName: 'name',
      representativeName: 'representative',
      phoneNumber: 'phone',
      businessLicense: 'business_license',
      ownerNID: 'owner_nid',
      establishedDate: 'established_date',
      workingPeriod: 'working_period',
      largeOption: 'large_option',
      location: 'location',
      restaurantImage: 'restaurant_image',
    };

    for (const key in this.formData) {
      if (this.formData.hasOwnProperty(key)) {
        const mappedKey = fieldMap[key] || key;
        form.append(mappedKey, this.formData[key]);
      }
    }

    // Debug log
    for (const [key, value] of form.entries()) {
      console.log(`${key}:`, value);
    }

    this.restaurantService.uploadRestaurant(form).subscribe({
      next: (res) => {
        console.log('Uploaded!', res);
        this.isLoading.set(false);
        this.isSuccessfull.set(true);
        setTimeout(() => {
          this.router.navigateByUrl('/admin/restaurants');
        }, 2000);
      },
      error: (err) => {
        console.warn('Upload failed', err);
        this.isLoading.set(false);
      },
    });
  }

  inputs = [
    {
      label: 'Restaurant Image',
      type: 'file',
      formControlName: 'restaurantImage',
      name: 'restaurantImage',
      class: 'col-md-12',
    },
    {
      label: 'Restaurant Name',
      type: 'text',
      formControlName: 'restaurantName',
      name: 'restaurantName',
      class: 'col-md-12',
    },
    {
      label: 'Representative Name',
      type: 'text',
      formControlName: 'representativeName',
      name: 'representativeName',
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
}
