import { Component, inject, OnInit, signal, HostListener } from '@angular/core';
import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';
import { FoodService } from '../../../shared/services/food.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { SlowNetworkService } from '../../../shared/services/slow-nerwork.service';
import { Food } from '../../../interfaces/food.interface';
import { BootstrapToastService } from '../../../shared/services/bootstrap-toast.service';
import { categorySubmitInterface } from '../../../interfaces/categorysubmit.intrface';

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
  restaurantId = signal<string>('');
  isGettingCategories: boolean = false;
  isAddingCategory: boolean = false;

  isLoading = signal<boolean>(false);
  isSuccessfull = signal<boolean>(false);
  hasDifferentSize = false;

  // Store the full category objects
  availableCategories: any[] = [];
  selectedCategory: any = null;

  // Modal controller variables
  isAddOthersOptionOpen = signal<boolean>(false);
  newCategoryName = '';

  // Custom dropdown properties
  isDropdownOpen = false;
  openMenuIndex: number | null = null;

  constructor(
    private router: Router,
    private toastr: BootstrapToastService,
    public slowNetwork: SlowNetworkService,
    private activeRoute: ActivatedRoute,
    private foodService: FoodService
  ) {}

  ngOnInit(): void {
    let id: string;
    id = this.activeRoute.snapshot.paramMap.get('id');
    this.restaurantId.set(id);

    // Get categories first, then initialize form data
    this.getCategories();
  }

  // *** Initialize form data after categories are loaded ***
  private initializeFormData(): void {
    this.inputs.forEach((input) => {
      if (input.type === 'select' && input.options?.length) {
        // For category dropdown, select the first actual category (not "Others")
        if (input.name === 'category' && this.availableCategories.length > 0) {
          this.selectedCategory = this.availableCategories[0];
          this.formData['category'] = this.selectedCategory.id;
          this.formData['categoryName'] = this.selectedCategory.name;
        }
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

  onSubmit(): void {
    const formData = new FormData();

    formData.append('name', this.formData['foodName'] || '');
    formData.append('description', this.formData['description'] || '');
    formData.append('price', this.formData['price']?.toString() || '0');
    formData.append('category', this.formData['category'] || ''); // Category ID
    formData.append('categoryName', this.formData['categoryName'] || ''); // Category Name
    formData.append('available', 'true'); // Default to true

    if (this.formData['image']) {
      formData.append('image', this.formData['image']); // File object
    }

    if (this.hasDifferentSize) {
      formData.append(
        'smallPrice',
        this.formData['smallPrice']?.toString() || ''
      );
      formData.append(
        'mediumPrice',
        this.formData['mediumPrice']?.toString() || ''
      );
      formData.append(
        'largePrice',
        this.formData['largePrice']?.toString() || ''
      );
    }

    // Just to see what's inside
    for (let [key, value] of formData.entries()) {
      console.log(key, value);
    }

    // Send it via your service
    this.foodService.createFood(formData, this.restaurantId()).subscribe({
      next: (res) => {
        console.log('✅ Food created:', res);
      },
      error: (err) => {
        console.error('❌ Error:', err);
      },
    });
  }

  // *** Method for getting categories ***
  getCategories(): void {
    this.isGettingCategories = true;
    this.foodService.getCategories(this.restaurantId()).subscribe({
      next: (data: any) => {
        console.log('Categories fetched:', data);

        // Store the full category objects
        this.availableCategories = data.results || [];

        // Create display options for the dropdown (names + "Others")
        const categoryNames = this.availableCategories.map(
          (category: any) => category.name
        );
        const allCategories = [...categoryNames, 'Others'];

        // Find the category input and update its options
        const categoryInput = this.inputs.find((i) => i.name === 'category');
        if (categoryInput) {
          categoryInput.options = allCategories;
        }

        // Initialize form data now that categories are loaded
        this.initializeFormData();

        this.isGettingCategories = false;
        this.toastr.showSuccess('Categories loaded successfully', 2000);
      },
      error: (err) => {
        console.error('Error fetching categories:', err);
        this.isGettingCategories = false;

        // Fallback to default categories if API fails
        const categoryInput = this.inputs.find((i) => i.name === 'category');
        if (categoryInput && !categoryInput.options?.length) {
          categoryInput.options = [
            'Pizza',
            'Burger',
            'Appetizer',
            'Drinks',
            'Dessert',
            'Others',
          ];
          // Create fallback category objects
          this.availableCategories = [
            { id: 1, name: 'Pizza' },
            { id: 2, name: 'Burger' },
            { id: 3, name: 'Appetizer' },
            { id: 4, name: 'Drinks' },
            { id: 5, name: 'Dessert' },
          ];
          this.initializeFormData();
        }

        this.toastr.showError(
          'Failed to load categories. Using default categories.',
          3000
        );
      },
    });
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
      // Find the category object by name
      const categoryObj = this.availableCategories.find(
        (cat) => cat.name === option
      );
      if (categoryObj) {
        this.selectedCategory = categoryObj;
        this.formData['category'] = categoryObj.id; // Store the ID
        this.formData['categoryName'] = categoryObj.name; // Store the name

        console.log('Selected category:', categoryObj);
      }
    }
    this.closeDropdown();
  }

  toggleOptionMenu(index: number): void {
    this.openMenuIndex = this.openMenuIndex === index ? null : index;
  }

  deleteCategory(category: string, index: number): void {
    // Empty console.log as requested
    console.log('Delete category:', category, 'at index:', index);
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
      if (this.availableCategories.length > 0) {
        this.selectedCategory = this.availableCategories[0];
        this.formData['category'] = this.selectedCategory.id;
        this.formData['categoryName'] = this.selectedCategory.name;
      }
    }
  }

  // *** Method to close modal ***
  closeModal() {
    this.isAddOthersOptionOpen.set(false);
    this.newCategoryName = '';
  }

  // *** Updated method to add new category using the service ***
  addNewCategory() {
    if (!this.newCategoryName?.trim()) {
      this.toastr.showWarning('Please enter a category name', 2000);
      return;
    }

    const trimmedCategory = this.newCategoryName.trim();

    // Check for duplicates (case-insensitive)
    const exists = this.availableCategories.some(
      (cat) => cat.name.toLowerCase() === trimmedCategory.toLowerCase()
    );

    if (exists) {
      this.toastr.showWarning(
        `Category "${trimmedCategory}" already exists`,
        3000
      );
      return;
    }

    // Use the service to create the category
    this.isAddingCategory = true;

    const data: categorySubmitInterface = {
      name: trimmedCategory,
    };

    this.foodService.createCategory(data, this.restaurantId()).subscribe({
      next: (response: any) => {
        console.log('Category created:', response);

        // Add the new category to our arrays
        const newCategory = {
          id: response.id, // Assuming API returns the created category with ID
          name: trimmedCategory,
        };

        this.availableCategories.push(newCategory);

        // Update dropdown options
        const categoryInput = this.inputs.find((i) => i.name === 'category');
        if (categoryInput) {
          // Insert before 'Others' option
          const othersIndex = categoryInput.options.indexOf('Others');
          if (othersIndex !== -1) {
            categoryInput.options.splice(othersIndex, 0, trimmedCategory);
          } else {
            categoryInput.options.push(trimmedCategory); // Fallback if "Others" is missing
          }
        }

        // Set the newly added category as selected
        this.selectedCategory = newCategory;
        this.formData['category'] = newCategory.id;
        this.formData['categoryName'] = newCategory.name;

        // Show success message
        this.toastr.showSuccess(
          `Category "${trimmedCategory}" added successfully`,
          3000
        );

        // Close modal and reset
        this.closeModal();
        this.isAddingCategory = false;
      },
      error: (err) => {
        console.error('Error creating category:', err);
        this.toastr.showError(err.message || 'Failed to add category', 3000);
        this.isAddingCategory = false;
      },
    });
  }

  inputs = [
    {
      label: 'Category',
      type: 'select',
      name: 'category',
      class: 'col-md-12',
      options: [], // Will be populated by getCategories()
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
