import { Component, inject, signal } from '@angular/core';
import { RestaurantService } from '../../../shared/services/restaurant.service';
import { Router } from '@angular/router';
import { RestaurantSubmit } from '../../../interfaces/restaurant-submit.interface';

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
  isDropdownOpen = signal<boolean>(false);

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

  removeRepImage(name: string): void {
    if (name === 'representativeImage') {
      this.repImagePreview = null;
      delete this.formData[name];
    }
  }

  removeImage(): void {
    this.imagePreview = null;
    delete this.formData['restaurantImage'];
  }

  onSubmit(): void {
    this.isLoading.set(true);
    const form = new FormData();

    // Create nested object
    const restaurantData: RestaurantSubmit = {
      restaurantName: this.formData['restaurantName'],
      restaurantNumber: this.formData['phoneNumber'], // Optional, can be string or number
      businessLicense: this.formData['businessLicense'],
      ownerNID: this.formData['ownerNID'],
      establishedDate: this.formData['establishedDate'],
      workingPeriod: this.formData['workingPeriod'],
      largeOption: this.formData['largeOption'],
      location: this.formData['location'],
      restaurantImage: this.formData['restaurantImage'],
      representativeInfo: {
        representativeName: this.formData['representativeName'],
        representativeNumber: this.formData['representativeNumber'],
        representativeLocation: this.formData['representativeLocation'],
        representativeImage: this.formData['representativeImage'],
      },
    };

    this.restaurantService.uploadRestaurant(restaurantData).subscribe({
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

  // REP IMAGE PREVIEW LOGIC

  repImagePreview: string | null = null;

  onRepImageChange(event: any, name: string) {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (name === 'restaurantImage') {
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
