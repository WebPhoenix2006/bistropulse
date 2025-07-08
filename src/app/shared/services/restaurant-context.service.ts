// restaurant-context.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class RestaurantContextService {
  private selectedRestaurantId = new BehaviorSubject<string | null>(null);
  selectedRestaurantId$ = this.selectedRestaurantId.asObservable();

  setRestaurantId(id: string) {
    this.selectedRestaurantId.next(id);
  }

  getRestaurantId(): string | null {
    return this.selectedRestaurantId.getValue();
  }
}
