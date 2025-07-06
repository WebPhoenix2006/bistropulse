import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LayoutComponent } from './layout/layout.component';
import { authGuard } from '../auth/auth.guard';
import { RestaurantListComponent } from './restaurant-managment/restaurant-managment.component';
import { AddRestaurantComponent } from './add-restaurant/add-restaurant.component';
import { CustomersComponent } from './customers/customers.component';
import { AddCustomerComponent } from './add-customer/add-customer.component';
import { RestaurantOverviewComponent } from './restaurant-overview/restaurant-overview.component';
import { ViewCustomerComponent } from './view-customer/view-customer.component';
import { CustomersOverviewComponent } from './customers-overview/customers-overview.component';
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
          { path: ':id', component: RestaurantOverviewComponent },
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
        path: 'food-menu',
        children: [
          { path: '', component: FoodListComponent },
          { path: 'add-food', component: AddFoodComponent },
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
