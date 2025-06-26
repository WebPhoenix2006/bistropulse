import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { SignupComponent } from './signup/signup.component';
import { LoginComponent } from './login/login.component';
import { FilterButtonComponent } from '../shared/components/filter-button/filter-button.component';
import { RestaurantListComponent } from '../admin/restaurant-managment/restaurant-managment.component';

@NgModule({
  declarations: [SignupComponent, LoginComponent, RestaurantListComponent],
  imports: [
    CommonModule,
    AuthRoutingModule,
    ReactiveFormsModule,
    RouterModule,
    FormsModule,
    SharedModule,
    FilterButtonComponent,
  ],
})
export class AuthModule {}
