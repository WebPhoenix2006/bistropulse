import { Component, inject, OnInit, signal } from '@angular/core';
import { FoodService } from '../../../shared/services/food-service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { SlowNetworkService } from '../../../shared/services/slow-nerwork.service';
import { Food } from '../../../interfaces/food.interface';

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

  // Modal controller variables
  isAddOthersOptionOpen = signal<boolean>(false);
  newCategoryName = '';

  constructor(
    private router: Router,
    private toastr: ToastrService,
    public slowNetwork: SlowNetworkService
  ) {}

  ngOnInit(): void {
    this.inputs.forEach((input) => {
      if (input.type === 'select' && input.options?.length) {
        this.formData[input.name] = input.options[0]; // selects first by default
      }
    });
  }

  onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = () => {
        this.imagePreview = reader.result;
      };

      reader.readAsDataURL(file);
      this.formData['image'] = file;
    }
  }

  onFileChange(event: Event, name: string) {
    const file = (event.target as HTMLInputElement)?.files?.[0];
    if (file) {
      this.formData[name] = file;
    }
  }

  generateId(): string {
    const chars =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 10; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  onSubmit(): void {
    const finalFoodData: Food = {
      categoryId: this.formData['category'] || '',
      id: this.generateId(),
      name: this.formData['foodName'] || '',
      price: Number(this.formData['price']) || 0,
      image: this.formData['image'] as File,
      description: this.formData['description'] || '',
      sizes: this.hasDifferentSize
        ? {
            smallPrice: this.formData['smallPrice']?.toString(),
            mediumPrice: this.formData['mediumPrice']?.toString(),
            largePrice: this.formData['largePrice']?.toString(),
          }
        : undefined,
    };

    console.log(finalFoodData);
  }

  removeImage(): void {
    this.imagePreview = null;
  }

  // *** Updated method for adding new category ***
  onCategoryChange(event: Event) {
    const selectedValue = (event.target as HTMLSelectElement).value;

    if (selectedValue === 'Others') {
      // Open the modal instead of using prompt
      this.isAddOthersOptionOpen.set(true);
      this.newCategoryName = ''; // Reset input

      // Reset select back to first option temporarily
      this.formData['category'] = this.inputs[0].options[0];
    }
  }

  // *** Method to close modal ***
  closeModal() {
    this.isAddOthersOptionOpen.set(false);
    this.newCategoryName = '';
  }

  // *** Method to add new category from modal ***
  addNewCategory() {
    if (this.newCategoryName && this.newCategoryName.trim()) {
      const trimmedCategory = this.newCategoryName.trim();

      // Add to the category list (avoid duplicates)
      const categoryInput = this.inputs.find((i) => i.name === 'category');
      if (categoryInput && !categoryInput.options.includes(trimmedCategory)) {
        // Insert before 'Others' option
        const othersIndex = categoryInput.options.indexOf('Others');
        categoryInput.options.splice(othersIndex, 0, trimmedCategory);
      }

      // Set the newly added category as selected
      this.formData['category'] = trimmedCategory;

      // Close modal
      this.closeModal();
    }
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
      placeholder: '₦0.00',
      name: 'price',
      class: 'col-md-12',
    },
  ];

  tempoaryInputs = [
    {
      label: 'Small',
      type: 'number',
      placeholder: '0.00',
      name: 'smallPrice',
    },
    {
      label: 'Medium',
      type: 'number',
      placeholder: '0.00',
      name: 'mediumPrice',
    },
    {
      label: 'Large',
      type: 'number',
      placeholder: '0.00',
      name: 'largePrice',
    },
  ];
}
