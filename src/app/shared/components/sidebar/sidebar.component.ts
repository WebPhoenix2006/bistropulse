import {
  Component,
  Input,
  Output,
  EventEmitter,
  inject,
  OnInit,
} from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { SIDEBAR_ITEMS, SidebarItem } from './sidebar.config';
import { RestaurantContextService } from '../../services/restaurant-context.service';

@Component({
  selector: 'app-sidebar',
  standalone: false,
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit {
  @Input() isSidebarCollapsed!: boolean;
  @Output() sidebarCollapse = new EventEmitter<boolean>();

  sidebarItems: SidebarItem[] = [];

  private authService = inject(AuthService);
  private router = inject(Router);
  private restaurantContext = inject(RestaurantContextService);

  ngOnInit(): void {
    const role = this.authService.getUserRole() || 'admin';

    // Subscribe to restaurant ID and update sidebar accordingly
    this.restaurantContext.selectedRestaurantId$.subscribe((restaurantId) => {
      // Filter by role first
      const filtered = SIDEBAR_ITEMS.filter(
        (item) => !item.roles || item.roles.includes(role)
      );

      // Inject restaurant ID into food menu routes
      this.sidebarItems = filtered
        .map((item) => {
          if (item.label === 'Food Menu') {
            // Only include Food Menu if we have a valid restaurantId
            if (!restaurantId) return null;

            const updatedChildren = item.children?.map((child) => ({
              ...child,
              route: child.route?.replace(':id', restaurantId),
            }));

            return {
              ...item,
              children: updatedChildren,
            };
          }
          return item;
        })
        .filter((item): item is SidebarItem => item !== null); // remove null items
    });
  }

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
}
