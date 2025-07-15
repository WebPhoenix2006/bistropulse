import { FilterButtonComponent } from './components/filter-button/filter-button.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from './components/button/button.component';
import { SearchFieldComponent } from './components/search-field/search-field.component';
import { FilterByPipe } from './pipes/filter.pipe';
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
import { EmptyListComponent } from './components/empty-list/empty-list.component';
import { ToggleSliderComponent } from './components/toggle-slider/toggle-slider.component';
import { NoSearchResultComponent } from './components/no-search-result/no-search-result.component';
import { OfflineBannerComponent } from './components/offline-banner/offline-banner.component';
import { DesignedH1Component } from './components/designed-h1/designed-h1.component';
import { ModalComponent } from './components/modal/modal.component';

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
    EmptyListComponent,
    ToggleSliderComponent,
    FilterByPipe,
    NoSearchResultComponent,
    OfflineBannerComponent,
    DesignedH1Component,
    ModalComponent
  ],
  imports: [CommonModule, FormsModule, RouterModule, RouterLink],
  exports: [
    ButtonComponent,
    SearchFieldComponent,
    DesignedH1Component,
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
    EmptyListComponent,
    ToggleSliderComponent,
    FilterByPipe,
    NoSearchResultComponent,
    OfflineBannerComponent,
    ModalComponent

  ],
})
export class SharedModule {}
