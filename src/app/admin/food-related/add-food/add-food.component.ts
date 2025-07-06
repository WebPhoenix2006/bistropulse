import { Component, inject, OnInit, signal } from '@angular/core';
import { FoodService } from '../../../shared/services/food-service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { SlowNetworkService } from '../../../shared/services/slow-nerwork.service';

@Component({
  selector: 'app-add-food',
  standalone: false,
  templateUrl: './add-food.component.html',
  styleUrl: './add-food.component.scss',
})
export class AddFoodComponent implements OnInit {
  imagePreview: string | ArrayBuffer | null = null;
  formData: { [key: string]: any } = {};
  foodService = inject(FoodService);
  isLoading = signal<boolean>(false);
  isSuccessfull = signal<boolean>(false);
  hasDifferentSize = false;

  onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = () => {
        this.imagePreview = reader.result;
      };

      reader.readAsDataURL(file);
      this.formData['restaurantImage'] = file;
    }
  }

  ngOnInit(): void {
    this.inputs.forEach((input) => {
      if (input.type === 'select' && input.options?.length) {
        this.formData[input.name] = input.options[0]; // selects first by default
      }
    });
  }

  onFileChange(event: Event, name: string) {
    const file = (event.target as HTMLInputElement)?.files?.[0];
    if (file) {
      this.formData[name] = file;
    }
  }

  constructor(
    private router: Router,
    private toastr: ToastrService,
    public slowNetwork: SlowNetworkService
  ) {}

  onSubmit(): void {
    this.isLoading.set(true);
    this.slowNetwork.start(() => {
      if (this.isLoading) {
      }
    });
    const form = new FormData();

    const fieldMap: Record<string, string> = {
      category: 'category',
      foodName: 'name',
      description: 'description',
      price: 'price',
      restaurantImage: 'image',
    };

    for (const key in this.formData) {
      if (this.formData.hasOwnProperty(key)) {
        const mappedKey = fieldMap[key] || key;
        form.append(mappedKey, this.formData[key]);
      }
    }

    const formDataObject = Object.fromEntries(Object.entries(this.formData));
    console.log(formDataObject);

    this.foodService.uploadCustomer(form).subscribe({
      next: (res) => {
        console.log('Uploaded!', res);
        this.isLoading.set(false);
        this.isSuccessfull.set(true);
        this.toastr.success('Added SuccessFully');
        this.router.navigateByUrl('/admin/restaurants');
      },
      error: (err) => {
        console.warn('Upload failed', err);
        this.isLoading.set(false);
      },
    });
  }

  removeImage(): void {
    this.imagePreview = null;
  }

  inputs = [
    {
      label: 'Category',
      type: 'select',
      name: 'category',
      class: 'col-md-12',
      options: ['Pizza', 'Burger', 'Appetizer', 'Drinks', 'Dessert', 'Others'],
    },
    {
      label: 'Food Name',
      type: 'text',
      name: 'foodName',
      class: 'col-md-12',
    },
    {
      label: 'Description',
      type: 'message',
      name: 'description',
      placeholder: 'Write ingredients. Separate by comma (,)',
      class: 'col-md-12',
    },
    {
      label: 'Price',
      type: 'number',
      placeholder: 'GHC 0.00',
      name: 'price',
      class: 'col-md-12',
    },
  ];
}
