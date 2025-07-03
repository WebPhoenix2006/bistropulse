import { Pipe, PipeTransform } from '@angular/core';
import { Customer } from '../../interfaces/customer.interface';

@Pipe({
  name: 'filterCustomers',
  standalone: false,
})
export class FilterCustomersPipe implements PipeTransform {
  transform(customers: Customer[], searchTerm: string): Customer[] {
    if (!searchTerm) {
      return customers;
    }

    const text = searchTerm.toLowerCase();
    return customers.filter((customer) => {
      return customer.name.toLowerCase().includes(text);
    });
  }
}
