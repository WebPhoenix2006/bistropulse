import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CustomersService } from '../../shared/services/customers.service';

@Component({
  selector: 'app-view-customer',
  standalone: false,
  templateUrl: './view-customer.component.html',
  styleUrl: './view-customer.component.scss'
})
export class ViewCustomerComponent {
customerId!: string;
  customer: any;
  isLoading = true;

  constructor(
    private route: ActivatedRoute,
    private customerService: CustomersService
  ) {}

  ngOnInit(): void {
    this.customerId = this.route.snapshot.paramMap.get('id')!;
    this.customerService.getCustomerById(this.customerId).subscribe({
      next: (res) => {
        this.customer = res;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to fetch customer', err);
        this.isLoading = false;
      },
    });
  }

}
