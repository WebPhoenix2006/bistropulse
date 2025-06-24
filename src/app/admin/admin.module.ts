import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { SharedModule } from '../shared/shared.module';
import { LayoutComponent } from './layout/layout.component';
import { RouterModule } from '@angular/router';


@NgModule({
  declarations: [LayoutComponent],
  imports: [
    CommonModule,
    AdminRoutingModule,
    RouterModule,
    SharedModule
  ]
})
export class AdminModule { }
