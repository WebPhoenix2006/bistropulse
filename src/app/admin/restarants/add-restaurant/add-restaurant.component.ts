import { Component, inject, signal } from '@angular/core';
import { RestaurantService } from '../../../shared/services/restaurant.service';
import { Router } from '@angular/router';
import { Restaurant } from '../../../interfaces/restaurant.interface';
import { RestaurantSubmit } from '../../../interfaces/restaurant-submit.interface';

@Component({
  selector: 'app-add-restaurant',
  standalone: false,
  templateUrl: './add-restaurant.component.html',
  styleUrl: './add-restaurant.component.scss',
})
export class AddRestaurantComponent {
  restaurantImagePreview: string | ArrayBuffer | null = null;
  representativeImagePreview: string | ArrayBuffer | null = null;
  formData: { [key: string]: any } = {};
  restaurantService = inject(RestaurantService);
  isLoading = signal<boolean>(false);
  isSuccessfull = signal<boolean>(false);
  isDropdownOpen = signal<boolean>(false);

  constructor(private router: Router) {}

  // Handle restaurant image file input
  onRestaurantImageChange(event: Event): void {
    const file = (event.target as HTMLInputElement)?.files?.[0];
    if (file) {
      this.formData['restaurantImage'] = file;
      const reader = new FileReader();
      reader.onload = () => {
        this.restaurantImagePreview = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  removeRestaurantImage(): void {
    this.restaurantImagePreview = null;
    delete this.formData['restaurantImage'];
  }

  // Handle representative image file input
  onRepresentativeImageChange(event: Event): void {
    const file = (event.target as HTMLInputElement)?.files?.[0];
    if (file) {
      this.formData['representativeImage'] = file;
      const reader = new FileReader();
      reader.onload = () => {
        this.representativeImagePreview = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  removeRepresentativeImage(): void {
    this.representativeImagePreview = null;
    delete this.formData['representativeImage'];
  }

  // General file handler for other files (e.g. pdfs)
  onFileChange(event: Event, name: string): void {
    const file = (event.target as HTMLInputElement)?.files?.[0];
    if (file) {
      this.formData[name] = file;
    }
  }

  onSubmit(): void {
    // Build a JSON object for submission (not FormData)
    const data: RestaurantSubmit = {
      restaurantName: this.formData['restaurantName'] || '',
      restaurantNumber: this.formData['phoneNumber'] || '',
      businessLicense: this.formData['businessLicense'] || null,
      ownerNID: this.formData['ownerNID'] || null,
      establishedDate: this.formData['establishedDate'] || '',
      workingPeriod: this.formData['workingPeriod'] || '',
      largeOption: this.formData['largeOption'] || '',
      location: this.formData['location'] || '',
      restaurantImage: this.formData['restaurantImage'] || null,
      representativeInfo: {
        representativeName: this.formData['representativeName'] || '',
        representativeNumber: this.formData['representativeNumber'] || '',
        representativeLocation: this.formData['representativeLocation'] || '',
        representativeImage: this.formData['representativeImage'] || null,
      },
    };
    console.log('Submit Data:', data);
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
