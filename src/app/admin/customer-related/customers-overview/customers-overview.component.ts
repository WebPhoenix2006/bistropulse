import { RESTAURANT_DUMMY_DATA } from './../../../mock-data/restaurant.dummy';
import { Component, inject, OnInit } from '@angular/core';
import { CustomersService } from '../../../shared/services/customers.service';
import { CustomerStateService } from '../../../shared/services/customer-state.service';
import { Observable, of } from 'rxjs';
import { CustomerReview } from '../../../interfaces/customer-review.interface';
import { MOCK_CUSTOMER_REVIEWS } from '../../../mock-data/customer.review';

@Component({
  selector: 'app-customers-overview',
  standalone: false,
  templateUrl: './customers-overview.component.html',
  styleUrl: './customers-overview.component.scss',
})
export class CustomersOverviewComponent implements OnInit {
  private customerService = inject(CustomersService);
  private customerState = inject(CustomerStateService);
  searchTerm: string = '';

  customers: any[] = [];
  isLoading = false;
  isEnabled = false;
  isActive = true;
  customer: any = null;
  branches: string[] = [];
  activeBranch: string = '';
  checkedOrders: Set<number> = new Set();

  favRestuarants: any[] = [];
  customerReviews: CustomerReview[] = [];

  MOCK_CUSTOMER_ORDERS = [
    {
      order_id: 'B0013789',
      details: 'Fufu (1), Banku(2), Bel-Aquat(1)',
      date: '2021-11-28',
      status: 'Pending',
      branch: 'Dindiridu',
      checked: false,
    },
    {
      order_id: 'B0013790',
      details: 'Fufu (1), Banku(2), Bel-Aquat(1)',
      date: '2021-11-28',
      status: 'Cancelled',
      branch: 'Dindiridu',
      checked: false,
    },
    {
      order_id: 'B0013791',
      details: 'Fufu (1), Banku(2), Bel-Aquat(1)',
      date: '2021-11-28',
      status: 'Preparing',
      branch: 'Damn',
      checked: false,
    },
    {
      order_id: 'B0013792',
      details: 'Fufu (1), Banku(2), Bel-Aquat(1)',
      date: '2021-11-28',
      status: 'Delivered',
      branch: 'Damn',
      checked: false,
    },
    {
      order_id: 'B0013793',
      details: 'Fufu (1), Banku(2), Bel-Aquat(1)',
      date: '2021-11-28',
      status: 'On the way',
      branch: 'Jalingo',
      checked: false,
    },
    {
      order_id: 'B0013794',
      details: 'Fufu (1), Banku(2), Bel-Aquat(1)',
      date: '2021-11-28',
      status: 'Cancelled',
      branch: 'Jalingo',
      checked: false,
    },
  ];

  getDummyDate(): Observable<any[]> {
    return of(RESTAURANT_DUMMY_DATA);
  }

  getDummyReviews(): Observable<CustomerReview[]> {
    return of(MOCK_CUSTOMER_REVIEWS);
  }

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
        this.loadCustomers();
      } else {
        console.warn(
          '❌ Token not found in localStorage. Skipping customer fetch.'
        );
      }
    } else {
      console.warn('⚠️ Running in SSR mode: skipping localStorage access.');
    }

    this.getDummyDate().subscribe((res) => {
      this.favRestuarants = res;
    });
    this.getDummyReviews().subscribe((res) => {
      this.customerReviews = res;
    });

    this.customerState.selectedCustomer$.subscribe((data) => {
      this.customer = data;
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

  loadCustomers() {
    this.isLoading = true;

    this.customerService.getCustomers().subscribe({
      next: (res: any) => {
        this.customers =
          res.results?.map((customer: any) => ({
            ...customer,
            checked: false,
          })) || [];

        this.isLoading = false;
      },
      error: (err) => {
        console.error('❌ Failed to fetch customers:', err);
        this.isLoading = false;
      },
    });
  }

  selectCustomer(customer: any) {
    this.customerState.setCustomer(customer);
  }

  isSelected(customer: any): boolean {
    const selected = this.customerState.getSelectedCustomerValue?.();
    return selected && selected.customer_id === customer.customer_id;
  }

  onToggle(state: boolean) {
    this.isEnabled = state;
    console.log('Switch is now:', state ? 'ON' : 'OFF');
  }
}
