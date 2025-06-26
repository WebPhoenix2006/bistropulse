import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-restaurant-list',
  standalone: false,
  templateUrl: './restaurant-list.component.html',
  styleUrl: './restaurant-list.component.scss',
})
export class RestaurantListComponent {
  restaurants = [
    {
      id: 1,
      name: 'Sun valley restaurant',
      representative: 'Darrell Steward',
      location: 'Aueduase',
      phone: '(408) 555-0120',
      rating: 4.8,
      status: 'Open',
      checked: false,
      isToolbarOpen: false,
    },
    {
      id: 2,
      name: 'Moon valley restaurant',
      representative: 'Darrell Steward',
      location: 'Asafoatse Nettey Road, Accra',
      phone: '(480) 555-0103',
      rating: 5.0,
      status: 'Closed',
      checked: false,
      isToolbarOpen: false,
    },
    {
      id: 3,
      name: 'Sun valley restaurant',
      representative: 'Darrell Steward',
      location: 'Aueduase',
      phone: '(603) 555-0123',
      rating: 4.5,
      status: 'Open',
      checked: false,
      isToolbarOpen: false,
    },
    {
      id: 4,
      name: 'Moon valley restaurant',
      representative: 'Darrell Steward',
      location: 'Nettey Road, Accra',
      phone: '(704) 555-0127',
      rating: 4.9,
      status: 'Closed',
      checked: false,
      isToolbarOpen: false,
    },
    {
      id: 5,
      name: 'Sun valley restaurant',
      representative: 'Darrell Steward',
      location: 'Asafoatse',
      phone: '(239) 555-0108',
      rating: 4.2,
      status: 'Open',
      checked: false,
      isToolbarOpen: false,
    },
    {
      id: 6,
      name: 'Star valley restaurant',
      representative: 'Darrell Steward',
      location: 'Asafoatse Nettey Road, Accra',
      phone: '(239) 555-0108',
      rating: 4.8,
      status: 'Closed',
      checked: false,
      isToolbarOpen: false,
    },
  ];

  @HostListener('window:click')
  closeToolbars() {
    this.restaurants = this.restaurants.map((restaurant) => {
      return {
        ...restaurant,
        isToolbarOpen: false,
      };
    });
  }

  toggleChecked(id: number): void {
    this.restaurants = this.restaurants.map((restaurant) => {
      if (restaurant.id === id) {
        return {
          ...restaurant,
          checked: !restaurant.checked,
        };
      }
      return restaurant;
    });
  }

  checkAll(): void {
    this.restaurants = this.restaurants.map((restaurant) => {
      return {
        ...restaurant,
        checked: !restaurant.checked,
      };
    });
  }

  toggleVisibility(id: number): void {
    this.closeToolbars();
    this.restaurants = this.restaurants.map((restaurant) => {
      if (restaurant.id === id) {
        return {
          ...restaurant,
          isToolbarOpen: !restaurant.isToolbarOpen,
        };
      } else {
        return restaurant;
      }
    });
  }
  closeAll(): void {
    this.restaurants = this.restaurants.map((restaurant) => {
      return {
        ...restaurant,
        isToolbarOpen: false,
      };
    });
  }
}
