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
import { OrderListComponent } from './order-related/order-overviews/order-list/order-list.component';
import { ExampleMenuComponent } from './order-related/order-overviews/example-menu/example-menu.component';
import { OrderHistoryComponent } from './order-related/order-overviews/order-history/order-history.component';
import { FranchiseListComponent } from './franchises/franchise-list/franchise-list.component';
import { AddFranchiseComponent } from './franchises/add-franchise/add-franchise.component';
import { BranchListComponent } from './franchises/branch-list/branch-list.component';
import { FranchiseOverviewComponent } from './franchises/franchise-overview/franchise-overview.component';
import { OrderTrackingComponent } from './order-related/order-tracking/order-tracking.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        component: DashboardComponent,
        canActivate: [authGuard],
        data: { animation: 'DashboardPage' },
      },
      {
        path: 'restaurants',
        data: { animation: 'Restaurants' },
        children: [
          {
            path: '',
            component: RestaurantListComponent,
            data: { animation: 'RestaurantList' },
          },
          {
            path: 'add-restaurant',
            component: AddRestaurantComponent,
            data: { animation: 'AddRestaurant' },
          },
          {
            path: ':id',
            children: [
              {
                path: '',
                component: RestaurantOverviewComponent,
                data: { animation: 'RestaurantOverview' },
              },
              {
                path: 'food-list',
                component: FoodListComponent,
                data: { animation: 'FoodList' },
              },
              {
                path: 'food-list/add-food',
                component: AddFoodComponent,
                data: { animation: 'AddFood' },
              },
              {
                path: 'food-list/:foodId/food-details',
                component: FoodDetailsComponent,
                data: { animation: 'FoodDetails' },
              },
              {
                path: 'categories',
                component: CategoriesComponent,
                data: { animation: 'Categories' },
              },
              {
                path: 'extras',
                component: ExtraComponent,
                data: { animation: 'Extras' },
              },
              {
                path: 'extras/add',
                component: AddExtraComponent,
                data: { animation: 'AddExtra' },
              },
            ],
          },
        ],
      },
      {
        path: 'riders',
        data: { animation: 'Riders' },
        children: [
          {
            path: '',
            component: RidersComponent,
            data: { animation: 'RidersList' },
          },
          {
            path: 'shifts',
            component: RiderShiftsComponent,
            data: { animation: 'RiderShifts' },
          },
          {
            path: ':id',
            children: [
              { path: '', redirectTo: 'overview', pathMatch: 'full' },
              {
                path: 'overview',
                component: RiderOverviewComponent,
                data: { animation: 'RiderOverview' },
              },
              {
                path: 'delivery',
                component: OrderTrackingComponent,
                data: { animation: 'RiderDelivery' },
              },
              {
                path: 'earnings',
                component: RiderDeliveryComponent,
                data: { animation: 'RiderEarnings' },
              },
              {
                path: 'reviews',
                component: RiderDeliveryComponent,
                data: { animation: 'RiderReviews' },
              },
            ],
          },
        ],
      },
      {
        path: 'customers',
        data: { animation: 'Customers' },
        children: [
          {
            path: '',
            component: CustomersComponent,
            data: { animation: 'CustomerList' },
          },
          {
            path: 'add-customer',
            component: AddCustomerComponent,
            data: { animation: 'AddCustomer' },
          },
          {
            path: ':id',
            component: CustomersOverviewComponent,
            data: { animation: 'CustomerOverview' },
          },
        ],
      },
      {
        path: 'orders',
        data: { animation: 'Orders' },
        children: [
          {
            path: '',
            component: OrderListComponent,
            data: { animation: 'OrderList' },
          },
          {
            path: 'example-menu',
            component: ExampleMenuComponent,
            data: { animation: 'ExampleMenu' },
          },
          {
            path: 'order-history',
            component: OrderHistoryComponent,
            data: { animation: 'OrderHistory' },
          },
        ],
      },
      {
        path: 'franchises',
        children: [
          { path: '', pathMatch: 'full', component: FranchiseListComponent },
          { path: 'add-franchise', component: AddFranchiseComponent },
          { path: ':franchiseId', component: FranchiseOverviewComponent },
          { path: ':franchiseId/branches', component: BranchListComponent },
        ],
      },
      { path: 'chat', component: ChatComponent },
      { path: 'otp', component: OtpManagementComponent },
      { path: 'chat', component: ChatComponent, data: { animation: 'Chat' } },
      {
        path: 'otp',
        component: OtpManagementComponent,
        data: { animation: 'OtpManagement' },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
