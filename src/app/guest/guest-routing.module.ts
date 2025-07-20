import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LayoutComponent } from './layout/layout.component';
import { AboutComponent } from './pages/about/about.component';
import { FeaturesComponent } from './pages/features/features.component';
import { TestimonialsComponent } from './pages/testimonials/testimonials.component';
import { IntergrationsComponent } from './pages/intergrations/intergrations.component';
import { PricingComponent } from './pages/pricing/pricing.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
      },
      {
        path: 'home',
        component: HomeComponent,
      },
      {
        path: 'about-us',
        component: AboutComponent,
      },
      {
        path: 'features',
        component: FeaturesComponent,
      },
      {
        path: 'testimonials',
        component: TestimonialsComponent,
      },
      {
        path: 'integrations',
        component: IntergrationsComponent,
      },
      {
        path: 'pricing',
        component: PricingComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GuestRoutingModule {}
