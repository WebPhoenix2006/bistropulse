# Shared Components Documentation

This folder contains reusable Angular UI components for consistent design and functionality across the application. Below is a summary of each component:

## Components Overview

### 1. ButtonComponent (`app-button`)

Configurable button with text, size, color, and type options.

### 2. DropdownComponent (`app-dropdown`)

Customizable dropdown menu with selectable options and event output.

### 3. EmptyListComponent (`app-empty-list`)

Displays a placeholder when a list is empty.

### 4. FilterButtonComponent (`app-filter-button`)

Button for filter actions with open/close state and filter logic hooks.

### 5. LoadingSpinnerComponent (`app-loading-spinner`)

Animated spinner for loading states.

### 6. MiniLoaderComponent (`app-mini-loader`)

Compact loader for small loading indicators.

### 7. NavbarComponent (`app-navbar`)

Navigation bar for app layout.

### 8. NoSearchResultComponent (`empty-search`)

Displays a message or illustration when no search results are found.

### 9. OfflineBannerComponent (`app-offline-banner`)

Banner that appears when the app is offline, using `OfflineService`.

### 10. PaginationComponent (`app-pagination`)

Pagination controls with page change event output.

### 11. SearchFieldComponent (`app-search-field`)

Input field for search functionality.

### 12. SidebarComponent (`app-sidebar`)

Sidebar navigation with dynamic items and role-based filtering.

### 13. SvgIconsComponent (`svg-icons`)

Renders SVG icons by name.

### 14. TabComponent (`cus-tab`)

Single tab for use in tabbed navigation.

### 15. TabsComponent (`cus-tabs`)

Container for multiple `TabComponent` instances, manages tab selection.

### 16. ToggleSliderComponent (`toggle-switch`)

Toggle switch with checked/disabled state and event output.

### 17. TooltipComponent (`app-tooltip`)

Tooltip for displaying additional information on hover.

---

## Usage

- Import the component in your module or use it directly if standalone.
- Add the selector in your template, e.g.:
  ```html
  <app-button buttonText="Save" color="primary"></app-button> <app-pagination [totalCount]="100" (pageChange)="onPageChange($event)"></app-pagination>
  ```
- Pass inputs and handle outputs as needed.

---

For more details, see each component's TypeScript file and template.
