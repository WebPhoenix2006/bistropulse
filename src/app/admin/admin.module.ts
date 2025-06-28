import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { SharedModule } from '../shared/shared.module';
import { LayoutComponent } from './layout/layout.component';
import { RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { RestaurantListComponent } from './restaurant-managment/restaurant-managment.component';
import { CustomersComponent } from './customers/customers.component';

@NgModule({
  declarations: [LayoutComponent, DashboardComponent, RestaurantListComponent, CustomersComponent],
  imports: [
    CommonModule,
    AdminRoutingModule,
    RouterModule,
    SharedModule,
    NgxChartsModule,
    NgIf,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AdminModule {}
