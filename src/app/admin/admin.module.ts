import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { SharedModule } from '../shared/shared.module';
import { LayoutComponent } from './layout/layout.component';
import { RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { RestaurantListComponent } from './restaurant-managment/restaurant-managment.component';
import { AddRestaurantComponent } from './add-restaurant/add-restaurant.component';
import { FormsModule } from '@angular/forms';
import { CustomersComponent } from './customers/customers.component';
import { AddCustomerComponent } from './add-customer/add-customer.component';
import { ViewCustomerComponent } from './view-customer/view-customer.component';
import { CustomersOverviewComponent } from './customers-overview/customers-overview.component';
import { FoodListComponent } from './food-related/food-list/food-menu.component';

@NgModule({
  declarations: [
    LayoutComponent,
    DashboardComponent,
    RestaurantListComponent,
    AddRestaurantComponent,
    CustomersComponent,
    AddCustomerComponent,
    ViewCustomerComponent,
    CustomersOverviewComponent,
    FoodListComponent,
  ],

  imports: [
    CommonModule,
    AdminRoutingModule,
    RouterModule,
    SharedModule,
    NgxChartsModule,
    FormsModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AdminModule {}
