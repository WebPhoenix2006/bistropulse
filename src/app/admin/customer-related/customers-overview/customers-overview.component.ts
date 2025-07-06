import { Component, inject } from '@angular/core';
import { CustomersService } from '../../../shared/services/customers.service';
import { CustomerStateService } from '../../../shared/services/customer-state.service';

@Component({
  selector: 'app-customers-overview',
  standalone: false,
  templateUrl: './customers-overview.component.html',
  styleUrl: './customers-overview.component.scss',
})
export class CustomersOverviewComponent {
  private customerService = inject(CustomersService);
  private customerState = inject(CustomerStateService);

  customers: any[] = [];
  isLoading = false;
  isEnabled = false;
  isActive = true;
  customer: any = null;
  editing = false;

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

    this.customerState.selectedCustomer$.subscribe((data) => {
      this.customer = data;
      this.editing = false; // reset editing when a new customer is selected
    });
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

  startEditing() {
    this.editing = true;
  }

  cancelEditing() {
    this.editing = false;
  }

  saveChanges() {
    if (!this.customer) return;

    console.log('🧪 Updating customer with ID:', this.customer.customer_id);
    console.log('🧪 Full customer object:', this.customer);

    this.customerService
      .updateCustomer(this.customer.customer_id, this.customer)
      .subscribe({
        next: (res) => {
          console.log('✅ Customer updated:', res);
          this.customer = res;
          this.customerState.setCustomer(res);
          this.editing = false;
        },
        error: (err) => {
          console.error('❌ Update failed:', err);
        },
      });
  }

  onToggle(state: boolean) {
    this.isEnabled = state;
    console.log('Switch is now:', state ? 'ON' : 'OFF');
  }
}
