import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

const STORAGE_KEY = 'selectedRestaurantId';

@Injectable({ providedIn: 'root' })
export class RestaurantContextService {
  private selectedRestaurantId = new BehaviorSubject<string | null>(
    localStorage.getItem(STORAGE_KEY) // load from localStorage if present
  );
  selectedRestaurantId$ = this.selectedRestaurantId.asObservable();

  setRestaurantId(id: string) {
    this.selectedRestaurantId.next(id);
    localStorage.setItem(STORAGE_KEY, id); // persist to localStorage
  }

  getRestaurantId(): string | null {
    return this.selectedRestaurantId.getValue();
  }

  clearRestaurantId() {
    this.selectedRestaurantId.next(null);
    localStorage.removeItem(STORAGE_KEY);
  }
}
