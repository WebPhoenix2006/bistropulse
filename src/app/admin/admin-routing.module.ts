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
        component: RestaurantListComponent,
      },
      {
        path: 'restaurants/add-restaurant',
        component: AddRestaurantComponent,
      },
      {
        path: 'customers',
        children: [
          { path: '', component: CustomersComponent },
          { path: 'add-customer', component: AddCustomerComponent },
          { path: ':id', component: CustomersOverviewComponent }, // 👈 dynamic detail route
        ],
      },
      {
        path: 'restaurant-overview',
        component: RestaurantOverviewComponent,
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
