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
import { FranchiseOrderListComponent } from './franchise-order-related/franchise-order-list/franchise-order-list.component';
import { FranchiseOrderHistoryComponent } from './franchise-order-related/franchise-order-history/franchise-order-history.component';
import { AddBranchComponent } from './franchises/add-branch/add-branch.component';
import { BranchRidersComponent } from './franchise-branch-rider-related/branch-riders/branch-riders.component';
import { BranchRiderShiftsComponent } from './franchise-branch-rider-related/branch-rider-shifts/branch-rider-shifts.component';
import { AddBranchRiderComponent } from './franchise-branch-rider-related/add-branch-rider/add-branch-rider.component';
import { RestaurantOrderListComponent } from './restarants/restaurant-order-list/restaurant-order-list.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },

      // ===================== DASHBOARD SECTION =====================
      {
        path: 'dashboard',
        component: DashboardComponent,
        canActivate: [authGuard],
        data: { animation: 'DashboardPage', breadcrumb: 'Dashboard' },
      },

      // ===================== RESTAURANTS SECTION =====================
      {
        path: 'restaurants',
        data: { animation: 'Restaurants', breadcrumb: 'Restaurants' },
        children: [
          // Restaurant List
          {
            path: '',
            component: RestaurantListComponent,
            data: { animation: 'RestaurantList', breadcrumb: 'List' },
          },
          // Add New Restaurant
          {
            path: 'add-restaurant',
            component: AddRestaurantComponent,
            data: { animation: 'AddRestaurant', breadcrumb: 'Add Restaurant' },
          },

          // ========== SPECIFIC RESTAURANT MANAGEMENT (:id) ==========
          {
            path: ':id',
            children: [
              // Restaurant Overview
              {
                path: '',
                component: RestaurantOverviewComponent,
                data: {
                  animation: 'RestaurantOverview',
                  breadcrumb: 'Overview',
                },
              },

              // --- Food Management ---
              {
                path: 'food-list',
                component: FoodListComponent,
                data: { animation: 'FoodList', breadcrumb: 'Food List' },
              },
              {
                path: 'food-list/add-food',
                component: AddFoodComponent,
                data: { animation: 'AddFood', breadcrumb: 'Add Food' },
              },
              {
                path: 'food-list/:foodId/food-details',
                component: FoodDetailsComponent,
                data: { animation: 'FoodDetails', breadcrumb: 'Food Details' },
              },
              {
                path: 'categories',
                component: CategoriesComponent,
                data: { animation: 'Categories', breadcrumb: 'Categories' },
              },
              {
                path: 'extras',
                component: ExtraComponent,
                data: { animation: 'Extras', breadcrumb: 'Extras' },
              },
              {
                path: 'extras/add',
                component: AddExtraComponent,
                data: { animation: 'AddExtra', breadcrumb: 'Add Extra' },
              },

              // *** INDIVIDUAL RESTAURANT ORDERS ***
              // Route: /restaurants/:id/orders
              // This shows orders for a SPECIFIC restaurant
              {
                path: 'orders',
                component: RestaurantOrderListComponent,
                data: { animation: 'OrderList', breadcrumb: 'Orders' },
              },

              // --- Restaurant Riders Management ---
              {
                path: 'riders',
                data: { animation: 'Riders', breadcrumb: 'Riders' },
                children: [
                  {
                    path: '',
                    component: RidersComponent,
                    data: { animation: 'RidersList', breadcrumb: 'List' },
                  },
                  {
                    path: 'shifts',
                    component: RiderShiftsComponent,
                    data: { animation: 'RiderShifts', breadcrumb: 'Shifts' },
                  },
                  {
                    path: 'overview',
                    component: RiderOverviewComponent,
                    data: {
                      animation: 'RiderOverview',
                      breadcrumb: 'overview',
                    },
                  },
                  {
                    path: 'add-rider',
                    component: AddRiderComponent,
                    data: { animation: 'AddRider', breadcrumb: 'Add' },
                  },
                  {
                    path: ':riderId',
                    children: [
                      { path: '', redirectTo: 'overview', pathMatch: 'full' },
                      {
                        path: 'delivery',
                        component: OrderTrackingComponent,
                        data: {
                          animation: 'RiderDelivery',
                          breadcrumb: 'Delivery',
                        },
                      },
                      {
                        path: 'earnings',
                        component: RiderDeliveryComponent,
                        data: {
                          animation: 'RiderEarnings',
                          breadcrumb: 'Earnings',
                        },
                      },
                      {
                        path: 'reviews',
                        component: RiderDeliveryComponent,
                        data: {
                          animation: 'RiderReviews',
                          breadcrumb: 'Reviews',
                        },
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },

      // ===================== CUSTOMERS SECTION =====================
      {
        path: 'customers',
        data: { animation: 'Customers', breadcrumb: 'Customers' },
        children: [
          {
            path: '',
            component: CustomersComponent,
            data: { animation: 'CustomerList', breadcrumb: 'List' },
          },
          {
            path: 'add-customer',
            component: AddCustomerComponent,
            data: { animation: 'AddCustomer', breadcrumb: 'Add Customer' },
          },
          {
            path: ':id',
            component: CustomersOverviewComponent,
            data: { animation: 'CustomerOverview', breadcrumb: 'Overview' },
          },
        ],
      },

      // ===================== GLOBAL ORDERS SECTION =====================
      // These routes handle ALL orders across the system
      {
        path: 'orders',
        data: { animation: 'Orders', breadcrumb: 'Orders' },
        children: [
          {
            path: '',
            component: OrderListComponent,
            data: { animation: 'OrderList', breadcrumb: 'List' },
          },
          {
            path: 'example-menu',
            component: ExampleMenuComponent,
            data: { animation: 'ExampleMenu', breadcrumb: 'Example Menu' },
          },
          {
            path: 'order-history',
            component: OrderHistoryComponent,
            data: { animation: 'OrderHistory', breadcrumb: 'Order History' },
          },
        ],
      },

      // ===================== FRANCHISES SECTION =====================
      {
        path: 'franchises',
        data: { breadcrumb: 'Franchises' },
        children: [
          // Franchise List & Management
          {
            path: '',
            component: FranchiseListComponent,
            data: { breadcrumb: 'List' },
          },
          {
            path: 'add-franchise',
            component: AddFranchiseComponent,
            data: { breadcrumb: 'Add Franchise' },
          },
          {
            path: 'orders',
            component: OrdersComponent,
            data: { breadcrumb: 'Orders' },
          },

          // ========== SPECIFIC FRANCHISE MANAGEMENT ==========
          {
            path: ':franchiseId',
            component: FranchiseOverviewComponent,
            data: { breadcrumb: 'Overview' },
          },

          // --- Branch Management ---
          {
            path: ':franchiseId/branches',
            component: BranchListComponent,
            data: { breadcrumb: 'Branches' },
          },
          {
            path: ':franchiseId/branches/add-branch',
            component: AddBranchComponent,
            data: { breadcrumb: 'Add Branch' },
          },

          // --- Branch-Specific Food Management ---
          {
            path: ':franchiseId/branches/:branchId/food-list',
            component: BranchListComponent,
            data: { breadcrumb: 'Food List' },
          },
          {
            path: ':franchiseId/branches/:branchId/food-list/:foodId',
            component: BranchListComponent,
            data: { breadcrumb: 'Food Details' },
          },
          {
            path: ':franchiseId/branches/:branchId/extras',
            component: BranchListComponent,
            data: { breadcrumb: 'Extras' },
          },
          {
            path: ':franchiseId/branches/:branchId/categories',
            component: BranchListComponent,
            data: { breadcrumb: 'Categories' },
          },

          // *** FRANCHISE BRANCH ORDERS ***
          {
            path: ':franchiseId/branches/:branchId/orders',
            component: FranchiseOrderListComponent,
            data: { breadcrumb: 'Branch Orders' },
          },
          {
            path: ':franchiseId/branches/:branchId/order-history',
            component: FranchiseOrderHistoryComponent,
            data: { breadcrumb: 'Order History' },
          },

          // --- Branch Riders Management ---
          {
            path: ':franchiseId/branches/:branchId/riders',
            data: { animation: 'BranchRiders', breadcrumb: 'Riders' },
            children: [
              {
                path: '',
                component: BranchRidersComponent,
                data: { animation: 'RidersList', breadcrumb: 'List' },
              },
              {
                path: 'shifts',
                component: BranchRiderShiftsComponent,
                data: { animation: 'RiderShifts', breadcrumb: 'Shifts' },
              },
              {
                path: 'add-rider',
                component: AddBranchRiderComponent,
                data: { animation: 'AddRider', breadcrumb: 'Add' },
              },
              {
                path: ':riderId',
                children: [
                  { path: '', redirectTo: 'overview', pathMatch: 'full' },
                  {
                    path: 'overview',
                    component: RiderOverviewComponent,
                    data: {
                      animation: 'RiderOverview',
                      breadcrumb: 'Overview',
                    },
                  },
                  {
                    path: 'delivery',
                    component: OrderTrackingComponent,
                    data: {
                      animation: 'RiderDelivery',
                      breadcrumb: 'Delivery',
                    },
                  },
                  {
                    path: 'earnings',
                    component: RiderDeliveryComponent,
                    data: {
                      animation: 'RiderEarnings',
                      breadcrumb: 'Earnings',
                    },
                  },
                  {
                    path: 'reviews',
                    component: RiderDeliveryComponent,
                    data: { animation: 'RiderReviews', breadcrumb: 'Reviews' },
                  },
                ],
              },
            ],
          },
        ],
      },

      // ===================== UTILITY SECTIONS =====================
      {
        path: 'chat',
        component: ChatComponent,
        data: { animation: 'Chat', breadcrumb: 'Chat' },
      },
      {
        path: 'otp',
        component: OtpManagementComponent,
        data: { animation: 'OtpManagement', breadcrumb: 'OTP' },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
