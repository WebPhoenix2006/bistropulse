import { Component, signal } from '@angular/core';
import { Food } from '../../../interfaces/food.interface';

@Component({
  selector: 'app-food-list',
  standalone: false,
  templateUrl: './food-list.component.html',
  styleUrl: './food-list.component.scss',
})
export class FoodListComponent {
  searchTerm: string = '';
  buttonText = signal<string>('Filter');
  isFilterModalOpen = signal<boolean>(false);
  isLoading = signal<boolean>(false);

  toggleFilterModal(): void {
    this.isFilterModalOpen.set(!this.isFilterModalOpen());
  }

  foods = [];

  toggleChecked(id): void {}

  toggleVisibility(id): void {}

  checkAll(): void {}
}
