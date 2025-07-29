import {
  Component,
  Input,
  Output,
  EventEmitter,
  inject,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Subject, takeUntil, filter } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { SIDEBAR_ITEMS, SidebarItem } from './sidebar.config';
import {
  RestaurantContextService,
  ContextState,
} from '../../services/restaurant-context.service';

@Component({
  selector: 'app-sidebar',
  standalone: false,
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit, OnDestroy {
  @Input() isSidebarCollapsed!: boolean;
  @Output() sidebarCollapse = new EventEmitter<boolean>();

  sidebarItems: SidebarItem[] = [];
  currentContext: ContextState['currentContext'] = 'none';
  currentUrl: string = '';

  private destroy$ = new Subject<void>();
  private authService = inject(AuthService);
  private router = inject(Router);
  private restaurantContext = inject(RestaurantContextService);

  ngOnInit(): void {
    const role = this.authService.getUserRole() || 'admin';

    // Get initial URL
    this.currentUrl = this.router.url;

    // Subscribe to route changes
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        takeUntil(this.destroy$)
      )
      .subscribe((event: NavigationEnd) => {
        this.currentUrl = event.urlAfterRedirects;
        // Rebuild sidebar when URL changes
        const contextState = this.restaurantContext.getCurrentContextState();
        this.sidebarItems = this.buildSidebarItems(role, contextState);
      });

    // Subscribe to context changes
    this.restaurantContext.contextState$
      .pipe(takeUntil(this.destroy$))
      .subscribe((contextState) => {
        this.currentContext = contextState.currentContext;
        this.sidebarItems = this.buildSidebarItems(role, contextState);
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private buildSidebarItems(
    role: string,
    contextState: ContextState
  ): SidebarItem[] {
    // Filter items by role first
    const roleFilteredItems = SIDEBAR_ITEMS.filter(
      (item) => !item.roles || item.roles.includes(role)
    );

    // Then filter and process based on display conditions
    return roleFilteredItems
      .map((item) => this.processMenuItem(item, contextState))
      .filter((item): item is SidebarItem => item !== null);
  }

  private processMenuItem(
    item: SidebarItem,
    contextState: ContextState
  ): SidebarItem | null {
    // Check if item should be displayed based on current context
    if (
      item.displayCondition &&
      !this.shouldShowItem(item.displayCondition, contextState)
    ) {
      return null;
    }

    // For dynamic route items, check if we have all required parameters
    if (item.routeType === 'dynamic' && item.route) {
      if (!this.hasRequiredParameters(item.route, contextState)) {
        return null; // Don't show if we don't have required parameters
      }
    }

    // Process the item
    const processedItem: SidebarItem = { ...item };

    // Handle dynamic routes
    if (item.routeType === 'dynamic' && item.route) {
      const dynamicRoute = this.buildDynamicRoute(item.route, contextState);
      if (!dynamicRoute) {
        // If we can't build the dynamic route, don't show the item
        return null;
      }
      processedItem.route = dynamicRoute;
    }

    // Process children recursively
    if (item.children) {
      const processedChildren = item.children
        .map((child) => this.processMenuItem(child, contextState))
        .filter((child): child is SidebarItem => child !== null);

      // If no children are visible, don't show the parent
      if (processedChildren.length === 0 && item.children.length > 0) {
        return null;
      }

      processedItem.children = processedChildren;
    }

    return processedItem;
  }

  private shouldShowItem(
    displayCondition: string,
    contextState: ContextState
  ): boolean {
    switch (displayCondition) {
      case 'always':
        return true;
      case 'restaurant-selected':
        // Only show if we have a valid restaurant ID
        return !!(contextState.restaurantId && 
                 contextState.restaurantId !== 'null' && 
                 contextState.restaurantId.trim() !== '');
      case 'franchise-selected':
        // Only show if we have a valid franchise ID
        return !!(contextState.franchiseId && 
                 contextState.franchiseId !== 'null' && 
                 contextState.franchiseId.trim() !== '');
      case 'branch-selected':
        // Only show if we have both valid franchise ID and branch ID
        return !!(contextState.branchId && 
                 contextState.branchId !== 'null' && 
                 contextState.branchId.trim() !== '' &&
                 contextState.franchiseId && 
                 contextState.franchiseId !== 'null' && 
                 contextState.franchiseId.trim() !== '');
      case 'franchise-list-page':
        return this.isFranchiseListPage();
      default:
        return true;
    }
  }

  private hasRequiredParameters(
    routeTemplate: string,
    contextState: ContextState
  ): boolean {
    // Check if route has :id parameter and we have restaurantId
    if (routeTemplate.includes(':id')) {
      if (!contextState.restaurantId || 
          contextState.restaurantId === 'null' || 
          contextState.restaurantId.trim() === '') {
        return false;
      }
    }

    // Check if route has :franchiseId parameter and we have franchiseId
    if (routeTemplate.includes(':franchiseId')) {
      if (!contextState.franchiseId || 
          contextState.franchiseId === 'null' || 
          contextState.franchiseId.trim() === '') {
        return false;
      }
    }

    // Check if route has :branchId parameter and we have branchId
    if (routeTemplate.includes(':branchId')) {
      if (!contextState.branchId || 
          contextState.branchId === 'null' || 
          contextState.branchId.trim() === '') {
        return false;
      }
    }

    return true;
  }

  private isFranchiseListPage(): boolean {
    // Only show on the main franchise list page, not on sub-pages
    const franchiseListPatterns = [
      '/admin/franchises', // Exact match
      '/admin/franchises/', // With trailing slash
      '/admin/franchises/add-franchise', // Add franchise page
    ];

    return (
      franchiseListPatterns.some(
        (pattern) =>
          this.currentUrl === pattern || this.currentUrl.startsWith(pattern)
      ) && !this.isNestedFranchisePage()
    );
  }

  private isNestedFranchisePage(): boolean {
    // Check if we're in a nested franchise page that should NOT show the Order Management
    const nestedPatterns = [
      '/admin/franchises/', // Any franchise detail page
    ];

    // If URL contains a franchise ID (UUID pattern or number after /franchises/)
    const franchiseDetailRegex = /\/admin\/franchises\/[^\/]+(?:\/|$)/;

    return (
      franchiseDetailRegex.test(this.currentUrl) &&
      this.currentUrl !== '/admin/franchises/add-franchise'
    );
  }

  private buildDynamicRoute(
    routeTemplate: string,
    contextState: ContextState
  ): string | null {
    let route = routeTemplate;

    // Replace restaurant ID - only if it exists and is valid
    if (route.includes(':id')) {
      if (!contextState.restaurantId || 
          contextState.restaurantId === 'null' || 
          contextState.restaurantId.trim() === '') {
        console.warn(`⚠️ Missing or invalid restaurantId for route: ${routeTemplate}`);
        return null;
      }
      route = route.replace(':id', contextState.restaurantId);
    }

    // Replace franchise ID - only if it exists and is valid
    if (route.includes(':franchiseId')) {
      if (!contextState.franchiseId || 
          contextState.franchiseId === 'null' || 
          contextState.franchiseId.trim() === '') {
        console.warn(`⚠️ Missing or invalid franchiseId for route: ${routeTemplate}`);
        return null;
      }
      route = route.replace(':franchiseId', contextState.franchiseId);
    }

    // Replace branch ID - only if it exists and is valid
    if (route.includes(':branchId')) {
      if (!contextState.branchId || 
          contextState.branchId === 'null' || 
          contextState.branchId.trim() === '') {
        console.warn(`⚠️ Missing or invalid branchId for route: ${routeTemplate}`);
        return null;
      }
      route = route.replace(':branchId', contextState.branchId);
    }

    // Check if all required parameters were replaced
    if (route.includes(':')) {
      console.warn(`⚠️ Route still contains unresolved parameters: ${route}`);
      return null;
    }

    return route;
  }

  // ============= EVENT HANDLERS =============
  logout() {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }

  openSidebar() {
    this.sidebarCollapse.emit(false);
  }

  collapseSidebar() {
    this.sidebarCollapse.emit(true);
  }

  // ============= HELPER METHODS FOR TEMPLATE =============
  getContextInfo(): string {
    const contextState = this.restaurantContext.getCurrentContextState();

    switch (contextState.currentContext) {
      case 'restaurant':
        return `Restaurant: ${contextState.restaurantId}`;
      case 'franchise':
        return `Franchise: ${contextState.franchiseId}`;
      case 'branch':
        return `Branch: ${contextState.branchId} (Franchise: ${contextState.franchiseId})`;
      default:
        return 'No context selected';
    }
  }

  clearCurrentContext() {
    this.restaurantContext.clearAllContext();
  }
}