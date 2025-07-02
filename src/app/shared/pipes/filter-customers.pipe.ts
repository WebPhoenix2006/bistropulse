import { Pipe, PipeTransform } from '@angular/core';
import { Restaurant } from '../../interfaces/restaurant.interface';
import { Customer } from '../../interfaces/customer.interface';

@Pipe({
  name: 'filterRestaurants',
  standalone: false,
})
export class FilterRestaurantsPipe implements PipeTransform {
  transform(customers: Customer[], searchTerm: string): Customer[] {
    if (!searchTerm) {
      return customers;
    }

    const text = searchTerm.toLowerCase();
    return customers.filter((restaurant) => {
      return restaurant.name.toLowerCase().includes(text);
    });
  }
}
