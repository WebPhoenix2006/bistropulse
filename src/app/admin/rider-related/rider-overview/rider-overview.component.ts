import { Component, inject, OnInit } from '@angular/core';
import { RiderStateService } from '../../../shared/services/rider-state.service';
import { RiderService } from '../../../shared/services/rider.service';

@Component({
  selector: 'app-rider-overview',
  standalone: false,
  templateUrl: './rider-overview.component.html',
  styleUrl: './rider-overview.component.scss'
})
export class RiderOverviewComponent implements OnInit {
private riderService = inject(RiderService);
  private riderState = inject(RiderStateService);
  searchTerm: string = '';

  riders: any[] = [];
  isLoading = false;
  isEnabled = false;
  isActive = true;
  rider: any = null;
  branches: string[] = [];
  activeBranch: string = '';
  checkedOrders: Set<number> = new Set();

  MOCK_CUSTOMER_ORDERS = [
    {
      order_id: 'B0013789',
      restaurant: 'Sun Vally Restaurant',
      date: '2021-11-28',
      status: 'Pending',
      branch: 'Dindiridu',
      checked: false,
    },
    {
      order_id: 'B0013790',
      restaurant: 'Sun Vally Restaurant',
      date: '2021-11-28',
      status: 'Cancelled',
      branch: 'Dindiridu',
      checked: false,
    },
    {
      order_id: 'B0013791',
      restaurant: 'Sun Vally Restaurant',
      date: '2021-11-28',
      status: 'Preparing',
      branch: 'Damn',
      checked: false,
    },
    {
      order_id: 'B0013792',
      restaurant: 'Sun Vally Restaurant',
      date: '2021-11-28',
      status: 'Delivered',
      branch: 'Damn',
      checked: false,
    },
    {
      order_id: 'B0013793',
      restaurant: 'Sun Vally Restaurant',
      date: '2021-11-28',
      status: 'On the way',
      branch: 'Jalingo',
      checked: false,
    },
    {
      order_id: 'B0013794',
      restaurant: 'Sun Vally Restaurant',
      date: '2021-11-28',
      status: 'Cancelled',
      branch: 'Jalingo',
      checked: false,
    },
  ];

  allChecked(branch: string): boolean {
    const orders = this.getOrdersByBranch(branch);
    return orders.every((order) => order.checked);
  }

  toggleSelection(order: any): void {
    order.checked = !order.checked;
  }

  toggleSelectAll(branch: string): void {
    const orders = this.getOrdersByBranch(branch);
    const shouldCheck = !this.allChecked(branch);
    orders.forEach((order) => (order.checked = shouldCheck));
  }

  orders = this.MOCK_CUSTOMER_ORDERS;

  ngOnInit(): void {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('auth_token');
      if (token) {
        this.loadRiders();
      } else {
        console.warn(
          '❌ Token not found in localStorage. Skipping rider fetch.'
        );
      }
    } else {
      console.warn('⚠️ Running in SSR mode: skipping localStorage access.');
    }

    this.riderState.selectedRider$.subscribe((data) => {
      this.rider = data;
    });

    this.branches = [
      'All',
      ...new Set(this.orders.map((order) => order.branch)),
    ];
    this.activeBranch = this.branches[0]; // default to first branch
  }

  getOrdersByBranch(branch: string) {
    if (branch === 'All') {
      return this.orders;
    }

    const filtered = this.orders.filter((order) => order.branch === branch);
    return filtered;
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

  loadRiders() {
    this.isLoading = true;

    this.riderService.getRiders().subscribe({
      next: (res: any) => {
        this.riders =
          res.results?.map((rider: any) => ({
            ...rider,
            checked: false,
          })) || [];

        this.isLoading = false;
      },
      error: (err) => {
        console.error('❌ Failed to fetch riders:', err);
        this.isLoading = false;
      },
    });
  }

  selectCustomer(rider: any) {
    this.riderState.setCustomer(rider);
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
