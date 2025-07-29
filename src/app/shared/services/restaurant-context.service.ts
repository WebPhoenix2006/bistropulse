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
    this.getValidStorageValue(RESTAURANT_STORAGE_KEY)
  );

  private selectedFranchiseId = new BehaviorSubject<string | null>(
    this.getValidStorageValue(FRANCHISE_STORAGE_KEY)
  );

  private selectedBranchId = new BehaviorSubject<string | null>(
    this.getValidStorageValue(BRANCH_STORAGE_KEY)
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

  // Helper method to get valid storage values (not null strings)
  private getValidStorageValue(key: string): string | null {
    const value = localStorage.getItem(key);
    if (!value || value === 'null' || value === 'undefined') {
      // Clean up invalid values
      localStorage.removeItem(key);
      return null;
    }
    return value;
  }

  // ============= RESTAURANT METHODS =============
  setRestaurantId(id: string) {
    if (!id || id === 'null' || id === 'undefined') {
      console.warn('⚠️ Attempted to set invalid restaurant ID:', id);
      return;
    }
    
    this.selectedRestaurantId.next(id);
    localStorage.setItem(RESTAURANT_STORAGE_KEY, id);
    // Clear franchise/branch when restaurant is selected
    this.clearFranchiseId();
    this.clearBranchId();
  }

  getRestaurantId(): string | null {
    const value = this.selectedRestaurantId.getValue();
    return (value && value !== 'null') ? value : null;
  }

  clearRestaurantId() {
    this.selectedRestaurantId.next(null);
    localStorage.removeItem(RESTAURANT_STORAGE_KEY);
  }

  // ============= FRANCHISE METHODS =============
  setFranchiseId(id: string) {
    if (!id || id === 'null' || id === 'undefined') {
      console.warn('⚠️ Attempted to set invalid franchise ID:', id);
      return;
    }

    this.selectedFranchiseId.next(id);
    localStorage.setItem(FRANCHISE_STORAGE_KEY, id);
    // Clear restaurant and branch when franchise is selected
    this.clearRestaurantId();
    this.clearBranchId();
  }

  getFranchiseId(): string | null {
    const value = this.selectedFranchiseId.getValue();
    return (value && value !== 'null') ? value : null;
  }

  clearFranchiseId() {
    this.selectedFranchiseId.next(null);
    localStorage.removeItem(FRANCHISE_STORAGE_KEY);
    // Also clear branch since it depends on franchise
    this.clearBranchId();
  }

  // ============= BRANCH METHODS =============
  setBranchId(branchId: string, franchiseId: string) {
    if (!branchId || branchId === 'null' || branchId === 'undefined' ||
        !franchiseId || franchiseId === 'null' || franchiseId === 'undefined') {
      console.warn('⚠️ Attempted to set invalid branch/franchise IDs:', { branchId, franchiseId });
      return;
    }

    // Set both franchise and branch
    this.selectedFranchiseId.next(franchiseId);
    this.selectedBranchId.next(branchId);
    localStorage.setItem(FRANCHISE_STORAGE_KEY, franchiseId);
    localStorage.setItem(BRANCH_STORAGE_KEY, branchId);
    // Clear restaurant when branch is selected
    this.clearRestaurantId();
  }

  getBranchId(): string | null {
    const value = this.selectedBranchId.getValue();
    return (value && value !== 'null') ? value : null;
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
    if (route.includes(':id')) {
      if (!context.restaurantId) {
        console.warn(`⚠️ Missing restaurantId for route: ${routeTemplate}`);
        return null;
      }
      route = route.replace(':id', context.restaurantId);
    }

    // Replace franchise ID
    if (route.includes(':franchiseId')) {
      if (!context.franchiseId) {
        console.warn(`⚠️ Missing franchiseId for route: ${routeTemplate}`);
        return null;
      }
      route = route.replace(':franchiseId', context.franchiseId);
    }

    // Replace branch ID
    if (route.includes(':branchId')) {
      if (!context.branchId) {
        console.warn(`⚠️ Missing branchId for route: ${routeTemplate}`);
        return null;
      }
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

  // ============= VALIDATION HELPERS =============
  isValidId(id: string | null): boolean {
    return !!(id && id !== 'null' && id !== 'undefined' && id.trim() !== '');
  }

  // Clean up any invalid stored values
  cleanupInvalidStorage() {
    const restaurantId = localStorage.getItem(RESTAURANT_STORAGE_KEY);
    const franchiseId = localStorage.getItem(FRANCHISE_STORAGE_KEY);
    const branchId = localStorage.getItem(BRANCH_STORAGE_KEY);

    if (!this.isValidId(restaurantId)) {
      localStorage.removeItem(RESTAURANT_STORAGE_KEY);
      this.selectedRestaurantId.next(null);
    }

    if (!this.isValidId(franchiseId)) {
      localStorage.removeItem(FRANCHISE_STORAGE_KEY);
      this.selectedFranchiseId.next(null);
    }

    if (!this.isValidId(branchId)) {
      localStorage.removeItem(BRANCH_STORAGE_KEY);
      this.selectedBranchId.next(null);
    }
  }
}