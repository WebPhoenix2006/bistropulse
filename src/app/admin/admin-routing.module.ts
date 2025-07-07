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
            ],
          },
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
