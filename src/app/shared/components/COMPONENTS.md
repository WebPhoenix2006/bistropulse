# Shared Components Documentation

This folder contains reusable Angular UI components for consistent design and functionality across the application. Below is a summary of each component:

## Components Overview

- **ButtonComponent (`app-button`)**: Configurable button with text, size, color, and type options.
- **DesignedH1Component (`app-h1`)**: Styled H1 heading for section titles.
- **DropdownComponent (`app-dropdown`)**: Customizable dropdown menu with selectable options and event output.
- **EmptyListComponent (`app-empty-list`)**: Displays a placeholder when a list is empty.
- **FilterButtonComponent (`app-filter-button`)**: Button for filter actions with open/close state and filter logic hooks.
- **LoadingSpinnerComponent (`app-loading-spinner`)**: Animated spinner for loading states.
- **MiniLoaderComponent (`app-mini-loader`)**: Compact loader for small loading indicators.
- **NavbarComponent (`app-navbar`)**: Navigation bar for app layout.
- **NoSearchResultComponent (`empty-search`)**: Displays a message or illustration when no search results are found.
- **OfflineBannerComponent (`app-offline-banner`)**: Banner that appears when the app is offline, using `OfflineService`.
- **PaginationComponent (`app-pagination`)**: Pagination controls with page change event output.
- **PopupComponent**: (Folder is empty, reserved for future use.)
- **SearchFieldComponent (`app-search-field`)**: Input field for search functionality.
- **SidebarComponent (`app-sidebar`)**: Sidebar navigation with dynamic items and role-based filtering.
- **SvgIconsComponent (`svg-icons`)**: Renders SVG icons by name.
- **TabComponent (`cus-tab`)**: Single tab for use in tabbed navigation.
- **TabsComponent (`cus-tabs`)**: Container for multiple `TabComponent` instances, manages tab selection.
- **ToggleSliderComponent (`toggle-switch`)**: Toggle switch with checked/disabled state and event output.
- **TooltipComponent (`app-tooltip`)**: Tooltip for displaying additional information on hover.

---

## Usage

- Import the component in your module or use it directly if standalone.
- Add the selector in your template, e.g.:
  ```html
  <app-button buttonText="Save" color="primary"></app-button>
  <app-pagination [totalCount]="100" (pageChange)="onPageChange($event)"></app-pagination>
  <app-h1 text="Section Title"></app-h1>
  <app-loading-spinner></app-loading-spinner>
  ```
- Pass inputs and handle outputs as needed.

---

For more details, see each component's TypeScript file and template.
