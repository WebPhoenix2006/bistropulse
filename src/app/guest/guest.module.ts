import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GuestRoutingModule } from './guest-routing.module';
import { HomeComponent } from './pages/home/home.component';
import { LayoutComponent } from './layout/layout.component';
import { RouterLink, RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { NavbarComponent } from './components/navbar/navbar.component';
import { AboutComponent } from './pages/about/about.component';
import { FeaturesComponent } from './pages/features/features.component';
import { IntergrationsComponent } from './pages/intergrations/intergrations.component';
import { PricingComponent } from './pages/pricing/pricing.component';
import { TestimonialsComponent } from './pages/testimonials/testimonials.component';

@NgModule({
  declarations: [
    LayoutComponent,
    HomeComponent,
    NavbarComponent,
    AboutComponent,
    FeaturesComponent,
    IntergrationsComponent,
    PricingComponent,
    TestimonialsComponent,
  ],
  imports: [
    CommonModule,
    GuestRoutingModule,
    RouterModule,
    ReactiveFormsModule,
    SharedModule,
    RouterLink,
  ],
})
export class GuestModule {}
