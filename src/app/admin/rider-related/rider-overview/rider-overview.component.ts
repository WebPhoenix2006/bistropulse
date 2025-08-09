import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { RiderStateService } from '../../../shared/services/rider-state.service';
import { RiderService } from '../../../shared/services/rider.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-rider-overview',
  templateUrl: './rider-overview.component.html',
  styleUrls: ['./rider-overview.component.scss'],
  standalone: false,
})
export class RiderOverviewComponent implements OnInit {
  private riderService = inject(RiderService);
  private riderState = inject(RiderStateService);
  private cdr = inject(ChangeDetectorRef);

  searchTerm = '';
  riders: any[] = [];
  isLoading = false;
  isEnabled = false;
  isActive = true;
  rider: any = null;
  branches: string[] = [];
  activeBranch = '';
  selectedTabIndex = 0;
  riderId: string | null = null;
  restaurantId: string | null = null;

  tabRoutes = ['overview', 'delivery', 'earnings', 'reviews'];

  orders = [
    {
      order_id: 'B0013789',
      restaurant: 'Sun Vally Restaurant',
      date: '2021-11-28',
      status: 'Pending',
      branch: 'Dindiridu',
      checked: false,
    },
    // other mock orders...
  ];

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    const token = localStorage.getItem('auth_token');
    if (token) {
      this.loadRiders();
    }

    this.riderState.selectedRider$.subscribe((data) => {
      this.rider = data;
      this.riderId = data?.rider_id || null;
    });

    this.branches = ['All', ...new Set(this.orders.map((o) => o.branch))];
    this.activeBranch = this.branches[0];

    this.route.paramMap.subscribe((params) => {
      this.riderId = params.get('id');
    });

    this.route.url.subscribe((segments) => {
      const tab = segments.length > 1 ? segments[1].path : 'overview';
      this.selectedTab(tab);
    });
    const id = this.route.snapshot.paramMap.get('id');
    this.restaurantId = id;
  }

  loadRiders() {
    this.isLoading = true;

    this.riderService.getRiders().subscribe({
      next: (res: any) => {
        this.riders = (res.results ?? []).map((rider: any) => ({
          ...rider,
          checked: false,
        }));
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to fetch riders:', err);
        this.isLoading = false;
      },
    });
  }

  onTabChanged(index: number) {
    const tab = this.tabRoutes[index];

    // Ensure we have the riderId (fallback to route param)
    if (!this.riderId) {
      this.riderId = this.route.snapshot.paramMap.get('id');
    }

    if (this.riderId) {
      this.router.navigate([`/admin/riders/${this.riderId}/${tab}`]);
    } else {
      console.warn('Rider ID is missing, cannot navigate');
    }
  }

  selectedTab(tab: string) {
    const index = this.tabRoutes.indexOf(tab);
    this.selectedTabIndex = index >= 0 ? index : 0;
    // 🛠 Fix ExpressionChanged error
    this.cdr.detectChanges();
  }

  getOrdersByBranch(branch: string) {
    return branch === 'All'
      ? this.orders
      : this.orders.filter((o) => o.branch === branch);
  }

  toggleSelection(order: any) {
    order.checked = !order.checked;
  }

  allChecked(branch: string): boolean {
    return this.getOrdersByBranch(branch).every((o) => o.checked);
  }

  toggleSelectAll(branch: string) {
    const shouldCheck = !this.allChecked(branch);
    this.getOrdersByBranch(branch).forEach((o) => (o.checked = shouldCheck));
  }

  getStatusClass(status: string): string {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'orange-badge';
      case 'cancelled':
        return 'red-badge';
      case 'preparing':
        return 'lightblue-badge';
      case 'delivered':
        return 'green-badge';
      case 'on the way':
        return 'darkblue-badge';
      default:
        return 'badge bg-secondary';
    }
  }

  selectRider(rider: any) {
    this.riderState.setCustomer(rider);
    this.riderId = rider?.rider_code || null;
    this.router.navigate([`/admin/riders/${this.riderId}/overview`]);
  }

  isSelected(rider: any): boolean {
    const selected = this.riderState.getSelectedCustomerValue?.();
    return selected && selected.rider_id === rider.rider_id;
  }

  onToggle(state: boolean) {
    this.isEnabled = state;
    console.log('Switch is now:', state ? 'ON' : 'OFF');
  }
}
