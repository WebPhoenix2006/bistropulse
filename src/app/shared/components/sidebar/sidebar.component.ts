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

    const restaurantId = this.restaurantContext.getRestaurantId(); // safe fallback
    if (!restaurantId) {
      console.warn(
        '⚠️ No restaurant ID found, sidebar may not show all routes'
      );
    }

    this.restaurantContext.selectedRestaurantId$.subscribe((restaurantId) => {
      const filtered = SIDEBAR_ITEMS.filter(
        (item) => !item.roles || item.roles.includes(role)
      );

      this.sidebarItems = filtered
        .map((item) => {
          if (item.label === 'Food Menu') {
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
        .filter((item): item is SidebarItem => item !== null);
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
