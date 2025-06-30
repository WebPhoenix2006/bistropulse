import { Component } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';

@Component({
  selector: 'app-restaurant-overview',
  imports: [SharedModule],
  templateUrl: './restaurant-overview.component.html',
  styleUrl: './restaurant-overview.component.scss',
})
export class RestaurantOverviewComponent {}
