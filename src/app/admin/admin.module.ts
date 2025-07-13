import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { SharedModule } from '../shared/shared.module';
import { LayoutComponent } from './layout/layout.component';
import { RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { RestaurantListComponent } from './restarants/restaurant-managment/restaurant-managment.component';
import { AddRestaurantComponent } from './restarants/add-restaurant/add-restaurant.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CustomersComponent } from './customer-related/customers/customers.component';
import { AddCustomerComponent } from './customer-related/add-customer/add-customer.component';
import { ViewCustomerComponent } from './customer-related/view-customer/view-customer.component';
import { CustomersOverviewComponent } from './customer-related/customers-overview/customers-overview.component';
import { FoodListComponent } from './food-related/food-list/food-menu.component';
import { AddFoodComponent } from './food-related/add-food/add-food.component';
import { OrdersComponent } from './order-related/orders/orders.component';
import { ChatComponent } from './chat/chat.component';
import { OtpManagementComponent } from './otp-management/otp-management.component';
import { OfflineBannerComponent } from '../shared/components/offline-banner/offline-banner.component';
import { FoodDetailsComponent } from './food-related/food-details/food-details.component';
import { RestaurantOverviewComponent } from './restarants/restaurant-overview/restaurant-overview.component';
import { CategoriesComponent } from './food-related/categories/categories.component';
import { ExtraComponent } from './food-related/extra/extra.component';

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
    AddFoodComponent,
    OrdersComponent,
    ChatComponent,
    OtpManagementComponent,
    FoodDetailsComponent,
    RestaurantOverviewComponent,
    CategoriesComponent,
    ExtraComponent,
  ],

  imports: [
    CommonModule,
    AdminRoutingModule,
    RouterModule,
    SharedModule,
    NgxChartsModule,
    FormsModule,
    ReactiveFormsModule,
    DatePipe,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AdminModule {}
