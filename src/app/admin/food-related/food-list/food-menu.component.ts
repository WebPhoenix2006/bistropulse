// food-list.component.ts
import { Component, HostListener, OnInit, signal } from '@angular/core';
import { Food } from '../../../interfaces/food.interface';
import { FilterByPipe } from '../../../shared/pipes/filter.pipe';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-food-list',
  standalone: false,
  templateUrl: './food-list.component.html',
  styleUrls: ['./food-list.component.scss'],
  providers: [FilterByPipe],
})
export class FoodListComponent implements OnInit {
  searchTerm = '';
  buttonText = signal<string>('Filter');
  isFilterModalOpen = signal<boolean>(false);
  isLoading = signal<boolean>(false);

  toggleFilterModal() {
    this.isFilterModalOpen.set(!this.isFilterModalOpen());
  }

  restaurantId!: string;

  selectFood(id: string): void {
    this.router.navigate([
      `/admin/restaurants/${this.restaurantId}/food-list/${id}/food-details`,
    ]);
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

  ngOnInit(): void {
    this.restaurantId = this.route.snapshot.paramMap.get('id')!;
  }

  constructor(
    private filterPipe: FilterByPipe,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  get filteredFoods(): any[] {
    return this.filterPipe.transform(this.foods, this.searchTerm, 'name');
  }

  foods: Food[] = [
    {
      name: 'Beef onion pizza',
      categoryId: this.generateId(),
      id: this.generateId(),
      price: 24.0,
      available: true,
      image: 'assets/food-images/food-1.png',
      isToolbarOpen: false,
      checked: false,
      categoryName: 'Appetizer',
    },
    {
      name: 'Cheese Pizza',
      categoryId: this.generateId(),
      price: 24.0,
      available: false,
      image: 'assets/food-images/food-2.png',
      isToolbarOpen: false,
      checked: false,
      categoryName: 'Appetizer',
      id: this.generateId(),
    },
    {
      name: 'Chicken burger',
      categoryId: this.generateId(),
      price: 24.0,
      available: false,
      image: 'assets/food-images/food-3.png',
      isToolbarOpen: false,
      checked: false,
      categoryName: 'Appetizer',
      id: this.generateId(),
    },
    {
      name: 'Beef burger',
      categoryId: this.generateId(),
      price: 24.0,
      available: false,
      image: 'assets/food-images/food-4.png',
      isToolbarOpen: false,
      checked: false,
      categoryName: 'Appetizer',
      id: this.generateId(),
    },
    {
      name: 'Beef special pizza',
      categoryId: this.generateId(),
      price: 24.0,
      available: false,
      image: 'assets/food-images/food-5.png',
      isToolbarOpen: false,
      checked: false,
      categoryName: 'Appetizer',
      id: this.generateId(),
    },
    {
      name: 'Cheese Pizza',
      categoryId: 'Appetizer',
      price: 24.0,
      available: false,
      image: 'assets/food-images/food-6.png',
      isToolbarOpen: false,
      checked: false,
      categoryName: 'Appetizer',
      id: this.generateId(),
    },
  ];

  selectedFoods = new Set<number>();
  openDropdownIndex: number | null = null;

  toggleDropdown(index: number) {
    this.openDropdownIndex = this.openDropdownIndex === index ? null : index;
  }

  toggleSelection(index: number) {
    const food = this.foods[index];
    food.checked = !food.checked;
  }

  toggleCheckedList(): void {
    const allSelected = this.foods.every((food) => food.checked);
    this.foods.forEach((food) => (food.checked = !allSelected));
  }

  isToolbarOpen(index: number): boolean {
    return this.openDropdownIndex === index;
  }

  allSelected(): boolean {
    return this.foods.every((food) => food.checked);
  }

  getStatusClass(status: 'Active' | 'Deactivate') {
    return status === 'Active' ? 'text-success' : 'text-danger';
  }

  deleteFood(id: string) {
    const idx = this.foods.findIndex((f) => f.id === id);
    if (idx !== -1) {
      this.foods.splice(idx, 1);
    }
  }

  @HostListener('document:click', ['$event'])
  handleDocumentClick(event: MouseEvent) {
    const clickedElement = event.target as HTMLElement;
    this.openDropdownIndex = null;

    const isInsideToolbar = clickedElement.closest('.toolbar') !== null;
    const isToolbarToggle = clickedElement.closest('.toolbar-toggle') !== null;
    const isInsideFilter = clickedElement.closest('#filter-modal') !== null;
    const isFilterButton =
      clickedElement.closest('#filter-modal-button') !== null;

    if (!isInsideToolbar && !isToolbarToggle) {
      this.selectedFoods.clear();
    }

    if (!isInsideFilter && !isFilterButton) {
      this.isFilterModalOpen.set(false);
    }
  }
}
