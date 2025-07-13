import { Component, signal } from '@angular/core';
import { FoodCategory } from '../../../interfaces/foodCategory.interface';

@Component({
  selector: 'app-categories',
  standalone: false,
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.scss',
})
export class CategoriesComponent {
  isCategoryModalOpen: boolean = false;
  newCategoryName: string = '';
  isConfirmDeleteModalOpen: boolean = false;
  categoryToDelete: string | null = null;
  isDeleteWarningModalOpen: boolean = false;

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

    const newId =
      'C' + (this.CATEGORY_LIST.length + 1).toString().padStart(3, '0');

    this.CATEGORY_LIST.push({
      id: newId,
      name: this.newCategoryName,
      itemCount: 0,
      checked: false,
    });

    this.newCategoryName = '';
    this.isCategoryModalOpen = false; // or this.isModalOpen = false if it's a boolean
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
