import { Component, inject } from '@angular/core';
import { CustomersService } from '../../shared/services/customers.service';

@Component({
  selector: 'app-customers-overview',
  standalone: false,
  templateUrl: './customers-overview.component.html',
  styleUrl: './customers-overview.component.scss',
})
export class CustomersOverviewComponent {
  customerService = inject(CustomersService);
  customers: any[] = [];
  isLoading = false;
  isEnabled = false;
  isActive = true;

  onToggle(state: boolean) {
    this.isEnabled = state;
    console.log('Switch is now:', state ? 'ON' : 'OFF');
  }

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
}
