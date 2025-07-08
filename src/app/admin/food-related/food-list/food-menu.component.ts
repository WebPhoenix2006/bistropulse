// food-list.component.ts
import { Component, HostListener, signal } from '@angular/core';

interface FoodItem {
  name: string;
  category: string;
  price: number;
  status: 'Active' | 'Deactivate';
  imageUrl: string;
  checked?: boolean; // <-- NEW
  isToolbarOpen?: boolean;
  id: string;
}

@Component({
  selector: 'app-food-list',
  standalone: false,
  templateUrl: './food-list.component.html',
  styleUrls: ['./food-list.component.scss'],
})
export class FoodListComponent {
  searchTerm = '';
  buttonText = signal<string>('Filter');
  isFilterModalOpen = signal<boolean>(false);
  isLoading = signal<boolean>(false);

  toggleFilterModal() {
    this.isFilterModalOpen.set(!this.isFilterModalOpen());
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

  foods: FoodItem[] = [
    {
      name: 'Beef onion pizza',
      id: this.generateId(),
      category: 'Pizza',
      price: 24.0,
      status: 'Active',
      imageUrl: 'assets/food-images/food-1.png',
      isToolbarOpen: false,
      checked: false,
    },
    {
      name: 'Cheese Pizza',
      category: 'Pizza',
      price: 24.0,
      status: 'Deactivate',
      imageUrl: 'assets/food-images/food-2.png',
      isToolbarOpen: false,
      checked: false,
      id: this.generateId(),
    },
    {
      name: 'Chicken burger',
      category: 'Burger',
      price: 24.0,
      status: 'Active',
      imageUrl: 'assets/food-images/food-3.png',
      isToolbarOpen: false,
      checked: false,
      id: this.generateId(),
    },
    {
      name: 'Beef burger',
      category: 'Burger',
      price: 24.0,
      status: 'Deactivate',
      imageUrl: 'assets/food-images/food-4.png',
      isToolbarOpen: false,
      checked: false,
      id: this.generateId(),
    },
    {
      name: 'Beef special pizza',
      category: 'Pizza',
      price: 24.0,
      status: 'Active',
      imageUrl: 'assets/food-images/food-5.png',
      isToolbarOpen: false,
      checked: false,
      id: this.generateId(),
    },
    {
      name: 'Cheese Pizza',
      category: 'Appetizer',
      price: 24.0,
      status: 'Deactivate',
      imageUrl: 'assets/food-images/food-6.png',
      isToolbarOpen: false,
      checked: false,
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

  clearCheckedList(): void {
    this.selectedFoods.clear();
  }

  toggleCheckedList(): void {
    const allSelected = this.foods.every((food) => food.checked);
    this.foods.forEach((food) => (food.checked = !allSelected));
  }

  isToolbarOpen(index: number): boolean {
    return this.openDropdownIndex === index;
  }

  isSelected(index: number): boolean {
    return this.selectedFoods.has(index);
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
