import { Component, inject, OnInit, signal, HostListener } from '@angular/core';
import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';
import { FoodService } from '../../../shared/services/food-service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { SlowNetworkService } from '../../../shared/services/slow-nerwork.service';
import { Food } from '../../../interfaces/food.interface';
import { BootstrapToastService } from '../../../shared/services/bootstrap-toast.service';

@Component({
  selector: 'app-add-food',
  standalone: false,
  templateUrl: './add-food.component.html',
  styleUrl: './add-food.component.scss',
  animations: [
    trigger('slideInOut', [
      state(
        'in',
        style({
          opacity: 1,
          transform: 'scaleY(1) translateY(0)',
          visibility: 'visible',
        })
      ),
      state(
        'out',
        style({
          opacity: 0,
          transform: 'scaleY(0.8) translateY(-10px)',
          visibility: 'hidden',
        })
      ),
      transition('out => in', [animate('200ms ease-out')]),
      transition('in => out', [animate('150ms ease-in')]),
    ]),
    trigger('fadeSlide', [
      state(
        'in',
        style({
          opacity: 1,
          transform: 'translateX(0) scale(1)',
          visibility: 'visible',
        })
      ),
      state(
        'out',
        style({
          opacity: 0,
          transform: 'translateX(10px) scale(0.95)',
          visibility: 'hidden',
        })
      ),
      transition('out => in', [animate('200ms ease-out')]),
      transition('in => out', [animate('150ms ease-in')]),
    ]),
  ],
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

  // Custom dropdown properties
  isDropdownOpen = false;
  openMenuIndex: number | null = null;

  constructor(
    private router: Router,
    private toastr: BootstrapToastService,
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

  // Custom Dropdown Methods
  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
    if (this.isDropdownOpen) {
      this.openMenuIndex = null; // Close any open menus
    }
  }

  closeDropdown(): void {
    this.isDropdownOpen = false;
    this.openMenuIndex = null;
  }

  selectOption(option: string, fieldName: string): void {
    if (option === 'Others') {
      this.isAddOthersOptionOpen.set(true);
      this.newCategoryName = '';
    } else {
      this.formData[fieldName] = option;
    }
    this.closeDropdown();
  }

  toggleOptionMenu(index: number): void {
    this.openMenuIndex = this.openMenuIndex === index ? null : index;
  }

  deleteCategory(category: string, index: number): void {
    // Don't allow deletion if it's the only category left (besides Others)
    const categoryInput = this.inputs.find((i) => i.name === 'category');
    if (categoryInput) {
      const nonOthersCategories = categoryInput.options.filter(
        (opt) => opt !== 'Others'
      );

      if (nonOthersCategories.length <= 1) {
        this.toastr.showWarning('You must have at least one category', 3000);
        this.openMenuIndex = null;
        return;
      }
    }

    // Show confirmation dialog
    if (
      confirm(`Are you sure you want to delete the category "${category}"?`)
    ) {
      if (categoryInput) {
        // Remove the category from options
        categoryInput.options = categoryInput.options.filter(
          (opt) => opt !== category
        );

        // If the deleted category was selected, reset to first available option
        if (this.formData['category'] === category) {
          this.formData['category'] = categoryInput.options[0];
        }

        // Show success message
        this.toastr.showSuccess(
          `Category "${category}" deleted successfully`,
          3000
        );
      }
    }

    // Close the menu
    this.openMenuIndex = null;
  }

  // Updated method to handle closing dropdown when clicking outside
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    const target = event.target as HTMLElement;
    const dropdownElement = target.closest('.custom-dropdown');

    if (!dropdownElement && this.isDropdownOpen) {
      this.closeDropdown();
    }
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

      const categoryInput = this.inputs.find((i) => i.name === 'category');
      if (categoryInput) {
        // Check for duplicates (case-insensitive)
        const exists = categoryInput.options.some(
          (opt) => opt.toLowerCase() === trimmedCategory.toLowerCase()
        );

        if (exists) {
          this.toastr.showWarning(
            `Category "${trimmedCategory}" already exists`,
            3000
          );
          return;
        }

        // Insert before 'Others' option
        const othersIndex = categoryInput.options.indexOf('Others');
        if (othersIndex !== -1) {
          categoryInput.options.splice(othersIndex, 0, trimmedCategory);
        } else {
          categoryInput.options.push(trimmedCategory); // Fallback if "Others" is missing
        }

        // Set the newly added category as selected
        this.formData['category'] = trimmedCategory;

        // Show success message
        this.toastr.showSuccess(
          `Category "${trimmedCategory}" added successfully`,
          3000
        );
      }

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
