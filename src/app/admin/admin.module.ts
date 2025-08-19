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
import { RidersComponent } from './rider-related/riders/riders.component';
import { AddRiderComponent } from './rider-related/add-rider/add-rider.component';
import { RiderShiftsComponent } from './rider-related/rider-shifts/rider-shifts.component';
import { AddExtraComponent } from './food-related/add-extra/add-extra.component';
import { RiderOverviewComponent } from './rider-related/rider-overview/rider-overview.component';
import { RiderDeliveryComponent } from './rider-related/rider-delivery/rider-delivery.component';
import { ExampleMenuComponent } from './order-related/order-overviews/example-menu/example-menu.component';
import { OrderHistoryComponent } from './order-related/order-overviews/order-history/order-history.component';
import { OrderListComponent } from './order-related/order-overviews/order-list/order-list.component';
import { OrderTrackingComponent } from './order-related/order-tracking/order-tracking.component';
import { FranchiseListComponent } from './franchises/franchise-list/franchise-list.component';
import { BranchListComponent } from './franchises/branch-list/branch-list.component';
import { AddBranchComponent } from './franchises/add-branch/add-branch.component';
import { AddFranchiseComponent } from './franchises/add-franchise/add-franchise.component';
import { BranchRiderShiftsComponent } from './franchise-branch-rider-related/branch-rider-shifts/branch-rider-shifts.component';
import { BranchRidersComponent } from './franchise-branch-rider-related/branch-riders/branch-riders.component';
import { AddBranchRiderComponent } from './franchise-branch-rider-related/add-branch-rider/add-branch-rider.component';
import { RestaurantOrderListComponent } from './restarants/restaurant-order-list/restaurant-order-list.component';
import { RestaurantOrderDetailsComponent } from './restarants/restaurant-order-details/restaurant-order-details.component';
import { AddOrderComponent } from './restarants/add-order/add-order.component';

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
    RidersComponent,
    AddRiderComponent,
    RiderShiftsComponent,
    AddExtraComponent,
    RiderOverviewComponent,
    RiderDeliveryComponent,
    FranchiseListComponent,
    AddBranchComponent,
    BranchListComponent,
    AddFranchiseComponent,
    BranchRiderShiftsComponent,
    BranchRidersComponent,
    AddBranchRiderComponent,
    OrderTrackingComponent,
    RestaurantOrderListComponent,
    RestaurantOrderDetailsComponent,
    CustomersOverviewComponent,
    AddOrderComponent,
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
