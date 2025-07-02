import { Pipe, PipeTransform } from '@angular/core';
import { Restaurant } from '../../interfaces/restaurant.interface';

@Pipe({
  name: 'filterRestaurants',
  standalone: false,
})
export class FilterRestaurantsPipe implements PipeTransform {
  transform(restaurants: Restaurant[], searchTerm: string): Restaurant[] {
    if (!searchTerm) {
      return restaurants;
    }

    const text = searchTerm.toLowerCase();
    return restaurants.filter((restaurant) => {
      return restaurant.name.toLowerCase().includes(text);
    });
  }
}
