import { Injectable, OnInit, OnDestroy, Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RestaurantContextService } from '../services/restaurant-context.service';
import { Subject, takeUntil } from 'rxjs';

/**
 * Base component that automatically handles context extraction from URL parameters
 * Extend this component in your restaurant/franchise/branch overview components
 */
@Injectable()
export abstract class ContextAwareComponent implements OnInit, OnDestroy {
  protected restaurantId: string | null = null;
  protected franchiseId: string | null = null;
  protected branchId: string | null = null;
  protected contextType: 'restaurant' | 'franchise' | 'branch' | null = null;

  protected destroy$ = new Subject<void>();

  constructor(
    protected route: ActivatedRoute,
    protected restaurantContext: RestaurantContextService
  ) {}

  ngOnInit(): void {
    this.initializeContext();
    this.onContextInitialized();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Override this method in child components to handle context initialization
   */
  protected abstract onContextInitialized(): void;

  private initializeContext(): void {
    // Subscribe to route parameter changes
    this.route.params.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      this.extractAndSetContext(params);
    });

    // Initial extraction
    this.extractAndSetContext(this.route.snapshot.params);
  }

  private extractAndSetContext(params: any): void {
    // Extract IDs from current route params
    const currentRestaurantId = params['id'];
    const currentFranchiseId = params['franchiseId'];
    const currentBranchId = params['branchId'];

    // Update context based on what we found
    if (currentBranchId && currentFranchiseId) {
      this.setBranchContext(currentBranchId, currentFranchiseId);
    } else if (currentFranchiseId) {
      this.setFranchiseContext(currentFranchiseId);
    } else if (currentRestaurantId) {
      this.setRestaurantContext(currentRestaurantId);
    }

    console.log('🔄 Context updated:', {
      restaurantId: this.restaurantId,
      franchiseId: this.franchiseId,
      branchId: this.branchId,
      contextType: this.contextType,
    });
  }

  protected setRestaurantContext(restaurantId: string): void {
    this.restaurantId = restaurantId;
    this.franchiseId = null;
    this.branchId = null;
    this.contextType = 'restaurant';

    // Update the context service
    this.restaurantContext.setRestaurantId(restaurantId);
  }

  protected setFranchiseContext(franchiseId: string): void {
    this.franchiseId = franchiseId;
    this.restaurantId = null;
    this.branchId = null;
    this.contextType = 'franchise';

    // Update the context service
    this.restaurantContext.setFranchiseId(franchiseId);
  }

  protected setBranchContext(branchId: string, franchiseId: string): void {
    this.branchId = branchId;
    this.franchiseId = franchiseId;
    this.restaurantId = null;
    this.contextType = 'branch';

    // Update the context service
    this.restaurantContext.setBranchId(branchId, franchiseId);
  }

  protected getCurrentContext() {
    return {
      restaurantId: this.restaurantId,
      franchiseId: this.franchiseId,
      branchId: this.branchId,
      contextType: this.contextType,
    };
  }
}

// ============= EXAMPLE USAGE =============

// Example: RestaurantOverviewComponent
/*
@Component({
  selector: 'app-restaurant-overview',
  templateUrl: './restaurant-overview.component.html'
})
export class RestaurantOverviewComponent extends ContextAwareComponent {
  restaurant: any = null;

  constructor(
    route: ActivatedRoute,
    restaurantContext: RestaurantContextService,
    private restaurantService: RestaurantService
  ) {
    super(route, restaurantContext);
  }

  protected onContextInitialized(): void {
    if (this.restaurantId) {
      this.loadRestaurantData(this.restaurantId);
    }
  }

  private loadRestaurantData(restaurantId: string): void {
    this.restaurantService.getRestaurant(restaurantId).subscribe(
      restaurant => {
        this.restaurant = restaurant;
        console.log('✅ Restaurant loaded:', restaurant);
      },
      error => console.error('❌ Failed to load restaurant:', error)
    );
  }
}
*/

// Example: FranchiseOverviewComponent
/*
@Component({
  selector: 'app-franchise-overview',
  templateUrl: './franchise-overview.component.html'
})
export class FranchiseOverviewComponent extends ContextAwareComponent {
  franchise: any = null;

  constructor(
    route: ActivatedRoute,
    restaurantContext: RestaurantContextService,
    private franchiseService: FranchiseService
  ) {
    super(route, restaurantContext);
  }

  protected onContextInitialized(): void {
    if (this.franchiseId) {
      this.loadFranchiseData(this.franchiseId);
    }
  }

  private loadFranchiseData(franchiseId: string): void {
    this.franchiseService.getFranchise(franchiseId).subscribe(
      franchise => {
        this.franchise = franchise;
        console.log('✅ Franchise loaded:', franchise);
      },
      error => console.error('❌ Failed to load franchise:', error)
    );
  }
}
*/

// Example: BranchListComponent (when used as branch detail)
/*
@Component({
  selector: 'app-branch-list',
  templateUrl: './branch-list.component.html'
})
export class BranchListComponent extends ContextAwareComponent {
  branches: any[] = [];
  currentBranch: any = null;

  constructor(
    route: ActivatedRoute,
    restaurantContext: RestaurantContextService,
    private branchService: BranchService
  ) {
    super(route, restaurantContext);
  }

  protected onContextInitialized(): void {
    if (this.contextType === 'branch' && this.branchId && this.franchiseId) {
      this.loadBranchData(this.branchId);
    } else if (this.contextType === 'franchise' && this.franchiseId) {
      this.loadBranchesForFranchise(this.franchiseId);
    }
  }

  private loadBranchData(branchId: string): void {
    this.branchService.getBranch(branchId).subscribe(
      branch => {
        this.currentBranch = branch;
        console.log('✅ Branch loaded:', branch);
      },
      error => console.error('❌ Failed to load branch:', error)
    );
  }

  private loadBranchesForFranchise(franchiseId: string): void {
    this.branchService.getBranchesByFranchise(franchiseId).subscribe(
      branches => {
        this.branches = branches;
        console.log('✅ Branches loaded:', branches);
      },
      error => console.error('❌ Failed to load branches:', error)
    );
  }
}
*/
