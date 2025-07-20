import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GuestRoutingModule } from './guest-routing.module';
import { HomeComponent } from './pages/home/home.component';
import { LayoutComponent } from './layout/layout.component';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { NavbarComponent } from './components/navbar/navbar.component';

@NgModule({
  declarations: [LayoutComponent, HomeComponent, NavbarComponent],
  imports: [
    CommonModule,
    GuestRoutingModule,
    RouterModule,
    ReactiveFormsModule,
    SharedModule,
  ],
})
export class GuestModule {}
