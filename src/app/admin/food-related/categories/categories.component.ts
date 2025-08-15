import { Component, OnInit, signal } from '@angular/core';
import { FoodCategory } from '../../../interfaces/foodCategory.interface';
import { FilterByPipe } from '../../../shared/pipes/filter.pipe';
import { categorySubmitInterface } from '../../../interfaces/categorysubmit.intrface';
import { FoodService } from '../../../shared/services/food.service';
import { BootstrapToastService } from '../../../shared/services/bootstrap-toast.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-categories',
  standalone: false,
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.scss',
  providers: [FilterByPipe],
})
export class CategoriesComponent implements OnInit {
  isCategoryModalOpen: boolean = false;
  newCategoryName: string = '';
  isConfirmDeleteModalOpen: boolean = false;
  categoryToDelete: string | null = null;
  searchTerm = signal<string>('');
  isDeleteWarningModalOpen: boolean = false;
  restaurantId = signal<string>('');
  isAddingCategory: boolean = false;

  filteredList: Array<FoodCategory> = [];

  constructor(
    private filterPipe: FilterByPipe,
    private foodService: FoodService,
    private toastr: BootstrapToastService,
    private activeRoute: ActivatedRoute
  ) {}

  CATEGORY_LIST: FoodCategory[] = [
    { id: 'C001', name: 'Smirnoff Ice', itemCount: 3, checked: false },
    { id: 'C002', name: 'Rosewood Origin', itemCount: 2, checked: false },
    { id: 'C003', name: 'Jack Daniels', itemCount: 2, checked: false },
    { id: 'C004', name: 'Belvedere', itemCount: 5, checked: false },
    { id: 'C005', name: 'Gulder', itemCount: 5, checked: false },
    { id: 'C006', name: 'Heineken', itemCount: 6, checked: false },
  ];

  openDeleteModal(id: string): void {
    this.categoryToDelete = id;
    this.isConfirmDeleteModalOpen = true;
  }

  addCategory(): void {
    if (!this.newCategoryName.trim()) return;
    this.isAddingCategory = true;

    const data: categorySubmitInterface = {
      name: this.newCategoryName,
    };

    this.foodService.createCategory(data, this.restaurantId()).subscribe({
      next: (data: any) => {
        this.toastr.showSuccess('added succefully', 2000);
        this.isAddingCategory = false;
        this.newCategoryName = '';
        console.log(data);
        this.isCategoryModalOpen = false; // or this.isModalOpen = false if it's a boolean
      },
      error: (err) => {
        this.toastr.showError(err.message || 'Failed to add category', 2000);
        this.isAddingCategory = false;
      },
    });
  }

  getCategories(): void {
    this.foodService.getCategories(this.restaurantId()).subscribe({
      next: (data: categorySubmitInterface[]) => {
        console.log(data);
        this.toastr.showSuccess('fetched Categories');
      },
      error: (err) => {
        this.toastr.showError('failed to fetch categories');
      },
    });
  }

  applyFilters(): void {
    this.filteredList = this.filterPipe.transform(
      this.CATEGORY_LIST,
      this.searchTerm(),
      'name'
    );
  }

  getRestaurantId(): void {
    let id: string;
    id = this.activeRoute.snapshot.paramMap.get('id');
    this.restaurantId.set(id);
  }

  ngOnInit(): void {
    this.applyFilters();
    this.getRestaurantId();
    this.getCategories();
  }

  confirmDelete(): void {
    if (!this.categoryToDelete) return;

    const category = this.CATEGORY_LIST.find(
      (c) => c.id === this.categoryToDelete
    );

    if (!category) return;

    // 🚨 Check if it has items
    if (category.itemCount > 0) {
      this.isConfirmDeleteModalOpen = false;
      this.isDeleteWarningModalOpen = true; // 🚫 show warning
      return;
    }

    // ✅ Safe to delete
    const idx = this.CATEGORY_LIST.findIndex((c) => c.id === category.id);
    if (idx !== -1) {
      this.CATEGORY_LIST.splice(idx, 1);
    }

    this.categoryToDelete = null;
    this.isConfirmDeleteModalOpen = false;
  }

  // Check if all categories are checked
  allChecked(): boolean {
    return this.CATEGORY_LIST.every((category) => category.checked);
  }

  // Toggle all checkboxes
  checkAllItems(): void {
    const shouldCheckAll = !this.allChecked();
    this.CATEGORY_LIST.forEach(
      (category) => (category.checked = shouldCheckAll)
    );
  }

  // Toggle single checkbox
  checkCategory(id: string): void {
    const category = this.CATEGORY_LIST.find((cat) => cat.id === id);
    if (category) {
      category.checked = !category.checked;
    }
  }
}
