import { FilterButtonComponent } from './components/filter-button/filter-button.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from './components/button/button.component';
import { SearchFieldComponent } from './components/search-field/search-field.component';
import { SvgIconsComponent } from './components/svg-icons/svg-icons.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { RouterLink, RouterModule } from '@angular/router';
import { TooltipComponent } from './components/tooltip/tooltip.component';
import { TabComponent } from './components/tab/tab.component';
import { TabsComponent } from './components/tabs/tabs.component';
import { DropdownComponent } from './components/dropdown/dropdown.component';
import { LoadingSpinnerComponent } from './components/loading-spinner/loading-spinner.component';
import { FormsModule } from '@angular/forms';
import { MiniLoaderComponent } from './components/mini-loader/mini-loader.component';
import { PaginationComponent } from './components/pagination/pagination.component';
import { FilterRestaurantsPipe } from './pipes/filter-restaurants.pipe';
import { EmptyListComponent } from './components/empty-list/empty-list.component';
import { FilterCustomersPipe } from './pipes/filter-customers.pipe';
import { ToggleSliderComponent } from './components/toggle-slider/toggle-slider.component';
import { PopupComponent } from './components/popup/popup.component';

@NgModule({
  declarations: [
    ButtonComponent,
    SvgIconsComponent,
    SidebarComponent,
    NavbarComponent,
    SearchFieldComponent,
    TooltipComponent,
    TabComponent,
    TabsComponent,
    DropdownComponent,
    LoadingSpinnerComponent,
    MiniLoaderComponent,
    PaginationComponent,
    FilterButtonComponent,
    FilterRestaurantsPipe,
    EmptyListComponent,
    FilterCustomersPipe,
    PopupComponent,
    ToggleSliderComponent,
  ],
  imports: [CommonModule, FormsModule, RouterModule, RouterLink],
  exports: [
    ButtonComponent,
    SearchFieldComponent,
    SvgIconsComponent,
    SidebarComponent,
    NavbarComponent,
    TooltipComponent,
    TabComponent,
    TabsComponent,
    DropdownComponent,
    LoadingSpinnerComponent,
    MiniLoaderComponent,
    PaginationComponent,
    FilterButtonComponent,
    FilterRestaurantsPipe,
    EmptyListComponent,
    FilterCustomersPipe,
    ToggleSliderComponent,
    PopupComponent,
  ],
})
export class SharedModule {}
