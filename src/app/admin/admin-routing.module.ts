import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LayoutComponent } from './layout/layout.component';
import { authGuard } from '../auth/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent, 
    children: [
      { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },
      
    ],
  },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
