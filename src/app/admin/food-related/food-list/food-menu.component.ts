// food-list.component.ts
import { Component, signal } from '@angular/core';

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

  toggleFilterModal(): void {
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
      imageUrl: 'assets/food1.jpg',
      checked: false,
      isToolbarOpen: false,
    },
    {
      name: 'Cheese Pizza',
      category: 'Pizza',
      price: 24.0,
      status: 'Deactivate',
      imageUrl: 'assets/food2.jpg',
      checked: false,
      isToolbarOpen: false,
      id: this.generateId(),
    },
    {
      name: 'Chicken burger',
      category: 'Burger',
      price: 24.0,
      status: 'Active',
      imageUrl: 'assets/food3.jpg',
      checked: false,
      isToolbarOpen: false,
      id: this.generateId(),
    },
    {
      name: 'Beef burger',
      category: 'Burger',
      price: 24.0,
      status: 'Deactivate',
      imageUrl: 'assets/food4.jpg',
      checked: false,
      isToolbarOpen: false,
      id: this.generateId(),
    },
    {
      name: 'Beef special pizza',
      category: 'Pizza',
      price: 24.0,
      status: 'Active',
      imageUrl: 'assets/food5.jpg',
      checked: false,
      isToolbarOpen: false,
      id: this.generateId(),
    },
    {
      name: 'Cheese Pizza',
      category: 'Appetizer',
      price: 24.0,
      status: 'Deactivate',
      imageUrl: 'assets/food6.jpg',
      checked: false,
      isToolbarOpen: false,
      id: this.generateId(),
    },
  ];

  selectedFoods = new Set<number>();
  openDropdownIndex: number | null = null;

  toggleDropdown(index: number) {
    this.openDropdownIndex = this.openDropdownIndex === index ? null : index;
  }

  toggleSelection(index: number) {
    if (this.selectedFoods.has(index)) {
      this.selectedFoods.delete(index);
    } else {
      this.selectedFoods.add(index);
    }
  }

  toggleChecked(id: string) {
    const matchingFood = this.foods.find((f) => f.id === id);
    this.foods = this.foods.map((food) => ({
      ...food,
      checked: !food.checked,
    }));
  }

  checkAll(): void {
    if (this.selectedFoods.size === this.foods.length) {
      this.selectedFoods.clear();
    } else {
      this.foods.forEach((_, index) => this.selectedFoods.add(index));
    }
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
}
