import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LayoutComponent } from './layout/layout.component';
import { authGuard } from '../auth/auth.guard';
import { RestaurantListComponent } from './restarants/restaurant-managment/restaurant-managment.component';
import { AddRestaurantComponent } from './restarants/add-restaurant/add-restaurant.component';
import { CustomersComponent } from './customer-related/customers/customers.component';
import { AddCustomerComponent } from './customer-related/add-customer/add-customer.component';
import { RestaurantOverviewComponent } from './restarants/restaurant-overview/restaurant-overview.component';
import { ViewCustomerComponent } from './customer-related/view-customer/view-customer.component';
import { CustomersOverviewComponent } from './customer-related/customers-overview/customers-overview.component';
import { FoodListComponent } from './food-related/food-list/food-menu.component';
import { AddFoodComponent } from './food-related/add-food/add-food.component';
import { OrdersComponent } from './order-related/orders/orders.component';
import { AddOrderComponent } from './order-related/add-order/add-order.component';
import { ChatComponent } from './chat/chat.component';
import { OtpManagementComponent } from './otp-management/otp-management.component';
import { FoodDetailsComponent } from './food-related/food-details/food-details.component';
import { CategoriesComponent } from './food-related/categories/categories.component';
import { ExtraComponent } from './food-related/extra/extra.component';
import { RidersComponent } from './rider-related/riders/riders.component';
import { AddRiderComponent } from './rider-related/add-rider/add-rider.component';
import { RiderShiftsComponent } from './rider-related/rider-shifts/rider-shifts.component';
import { AddExtraComponent } from './food-related/add-extra/add-extra.component';
import { RiderOverviewComponent } from './rider-related/rider-overview/rider-overview.component';
import { RiderDeliveryComponent } from './rider-related/rider-delivery/rider-delivery.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        component: DashboardComponent,
        canActivate: [authGuard],
      },
      {
        path: 'restaurants',
        children: [
          { path: '', component: RestaurantListComponent },
          { path: 'add-restaurant', component: AddRestaurantComponent },
          {
            path: ':id',
            children: [
              { path: '', component: RestaurantOverviewComponent },
              { path: 'food-list', component: FoodListComponent },
              { path: 'food-list/add-food', component: AddFoodComponent },
              {
                path: 'food-list/:foodId/food-details',
                component: FoodDetailsComponent,
              },
              { path: 'categories', component: CategoriesComponent },
              { path: 'extras', component: ExtraComponent },
              { path: 'extras/add', component: AddExtraComponent },
            ],
          },
        ],
      },
      {
        path: 'riders',
        children: [
          { path: '', component: RidersComponent },
          { path: 'shifts', component: RiderShiftsComponent },
          {
            path: ':id',
            children: [
              { path: '', redirectTo: 'overview', pathMatch: 'full' },
              { path: 'overview', component: RiderOverviewComponent },
              { path: 'delivery', component: RiderDeliveryComponent },
              { path: 'earnings', component: RiderDeliveryComponent },
              { path: 'reviews', component: RiderDeliveryComponent },
            ],
          }, // 👈 dynamic
        ],
      },
      {
        path: 'customers',
        children: [
          { path: '', component: CustomersComponent },
          { path: 'add-customer', component: AddCustomerComponent },
          { path: ':id', component: CustomersOverviewComponent }, // 👈 dynamic
        ],
      },
      {
        path: 'orders',
        children: [
          { path: '', component: OrdersComponent },
          { path: 'add-order', component: AddOrderComponent },
        ],
      },
      { path: 'chat', component: ChatComponent },
      { path: 'otp', component: OtpManagementComponent },
    ],
  },
  // Remove this line:
  // { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
