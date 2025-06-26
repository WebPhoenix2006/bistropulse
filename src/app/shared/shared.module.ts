import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from './components/button/button.component';
import { SearchFieldComponent } from './components/search-field/search-field.component';
import { SvgIconsComponent } from './components/svg-icons/svg-icons.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { RouterModule } from '@angular/router';
import { TooltipComponent } from './components/tooltip/tooltip.component';
import { TabComponent } from './components/tab/tab.component';
import { TabsComponent } from './components/tabs/tabs.component';

@NgModule({
  declarations: [
    ButtonComponent,
    SearchFieldComponent,
    SvgIconsComponent,
    SidebarComponent,
    NavbarComponent,
    SearchFieldComponent,
    TooltipComponent,
    TabComponent,
    TabsComponent


  ],
  imports: [CommonModule, RouterModule],
  exports: [
    ButtonComponent,
    SearchFieldComponent,
    SvgIconsComponent,
    SidebarComponent,
    NavbarComponent,
    TooltipComponent,
    TabComponent,
    TabsComponent

  ],
})
export class SharedModule {}
