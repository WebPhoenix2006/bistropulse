import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, map } from 'rxjs';

// Storage keys
const RESTAURANT_STORAGE_KEY = 'selectedRestaurantId';
const FRANCHISE_STORAGE_KEY = 'selectedFranchiseId';
const BRANCH_STORAGE_KEY = 'selectedBranchId';

export interface ContextState {
  restaurantId: string | null;
  franchiseId: string | null;
  branchId: string | null;
  currentContext: 'none' | 'restaurant' | 'franchise' | 'branch';
}

@Injectable({ providedIn: 'root' })
export class RestaurantContextService {
  // Individual subjects for each ID type
  private selectedRestaurantId = new BehaviorSubject<string | null>(
    localStorage.getItem(RESTAURANT_STORAGE_KEY)
  );

  private selectedFranchiseId = new BehaviorSubject<string | null>(
    localStorage.getItem(FRANCHISE_STORAGE_KEY)
  );

  private selectedBranchId = new BehaviorSubject<string | null>(
    localStorage.getItem(BRANCH_STORAGE_KEY)
  );

  // Individual observables
  selectedRestaurantId$ = this.selectedRestaurantId.asObservable();
  selectedFranchiseId$ = this.selectedFranchiseId.asObservable();
  selectedBranchId$ = this.selectedBranchId.asObservable();

  // Combined context state observable
  contextState$ = combineLatest([
    this.selectedRestaurantId$,
    this.selectedFranchiseId$,
    this.selectedBranchId$,
  ]).pipe(
    map(([restaurantId, franchiseId, branchId]): ContextState => {
      let currentContext: ContextState['currentContext'] = 'none';

      if (branchId && franchiseId) {
        currentContext = 'branch';
      } else if (franchiseId) {
        currentContext = 'franchise';
      } else if (restaurantId) {
        currentContext = 'restaurant';
      }

      return {
        restaurantId,
        franchiseId,
        branchId,
        currentContext,
      };
    })
  );

  // ============= RESTAURANT METHODS =============
  setRestaurantId(id: string) {
    this.selectedRestaurantId.next(id);
    localStorage.setItem(RESTAURANT_STORAGE_KEY, id);
    // Clear franchise/branch when restaurant is selected
    this.clearFranchiseId();
    this.clearBranchId();
  }

  getRestaurantId(): string | null {
    return this.selectedRestaurantId.getValue();
  }

  clearRestaurantId() {
    this.selectedRestaurantId.next(null);
    localStorage.removeItem(RESTAURANT_STORAGE_KEY);
  }

  // ============= FRANCHISE METHODS =============
  setFranchiseId(id: string) {
    this.selectedFranchiseId.next(id);
    localStorage.setItem(FRANCHISE_STORAGE_KEY, id);
    // Clear restaurant and branch when franchise is selected
    this.clearRestaurantId();
    this.clearBranchId();
  }

  getFranchiseId(): string | null {
    return this.selectedFranchiseId.getValue();
  }

  clearFranchiseId() {
    this.selectedFranchiseId.next(null);
    localStorage.removeItem(FRANCHISE_STORAGE_KEY);
    // Also clear branch since it depends on franchise
    this.clearBranchId();
  }

  // ============= BRANCH METHODS =============
  setBranchId(branchId: string, franchiseId: string) {
    // Set both franchise and branch
    this.selectedFranchiseId.next(franchiseId);
    this.selectedBranchId.next(branchId);
    localStorage.setItem(FRANCHISE_STORAGE_KEY, franchiseId);
    localStorage.setItem(BRANCH_STORAGE_KEY, branchId);
    // Clear restaurant when branch is selected
    this.clearRestaurantId();
  }

  getBranchId(): string | null {
    return this.selectedBranchId.getValue();
  }

  clearBranchId() {
    this.selectedBranchId.next(null);
    localStorage.removeItem(BRANCH_STORAGE_KEY);
  }

  // ============= UTILITY METHODS =============
  getCurrentContext(): ContextState['currentContext'] {
    const restaurantId = this.getRestaurantId();
    const franchiseId = this.getFranchiseId();
    const branchId = this.getBranchId();

    if (branchId && franchiseId) return 'branch';
    if (franchiseId) return 'franchise';
    if (restaurantId) return 'restaurant';
    return 'none';
  }

  getCurrentContextState(): ContextState {
    return {
      restaurantId: this.getRestaurantId(),
      franchiseId: this.getFranchiseId(),
      branchId: this.getBranchId(),
      currentContext: this.getCurrentContext(),
    };
  }

  clearAllContext() {
    this.clearRestaurantId();
    this.clearFranchiseId();
    this.clearBranchId();
  }

  // ============= ROUTE HELPER METHODS =============
  buildDynamicRoute(routeTemplate: string): string | null {
    const context = this.getCurrentContextState();
    let route = routeTemplate;

    // Replace restaurant ID
    if (route.includes(':id') && context.restaurantId) {
      route = route.replace(':id', context.restaurantId);
    }

    // Replace franchise ID
    if (route.includes(':franchiseId') && context.franchiseId) {
      route = route.replace(':franchiseId', context.franchiseId);
    }

    // Replace branch ID
    if (route.includes(':branchId') && context.branchId) {
      route = route.replace(':branchId', context.branchId);
    }

    // Check if all required parameters were replaced
    if (route.includes(':')) {
      console.warn(`⚠️ Route still contains unresolved parameters: ${route}`);
      return null;
    }

    return route;
  }

  shouldShowItem(displayCondition: string): boolean {
    const currentContext = this.getCurrentContext();

    switch (displayCondition) {
      case 'always':
        return true;
      case 'restaurant-selected':
        return currentContext === 'restaurant';
      case 'franchise-selected':
        return currentContext === 'franchise';
      case 'branch-selected':
        return currentContext === 'branch';
      default:
        return true;
    }
  }
}
