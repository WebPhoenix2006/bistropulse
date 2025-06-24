import { Component } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { FilterButtonComponent } from '../../shared/components/filter-button/filter-button.component';

@Component({
  selector: 'app-restaurant-list',
  imports: [SharedModule, FilterButtonComponent],
  templateUrl: './restaurant-list.component.html',
  styleUrl: './restaurant-list.component.scss',
})
export class RestaurantListComponent {}
