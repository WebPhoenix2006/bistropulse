// ============= UPDATED SIDEBAR CONFIG =============
export interface SidebarItem {
  label: string;
  icon?: string;
  route?: string;
  collapseId?: string;
  roles?: string[];
  children?: SidebarItem[];
  // NEW PROPERTIES for dynamic display
  displayCondition?:
    | 'always'
    | 'restaurant-selected'
    | 'branch-selected'
    | 'franchise-selected'
    | 'franchise-list-page';
  routeType?: 'static' | 'dynamic';
}

export const SIDEBAR_ITEMS: SidebarItem[] = [
  {
    label: 'Dashboard',
    icon: 'dashboard',
    route: '/admin/dashboard',
    roles: ['admin', 'manager', 'employee'],
    displayCondition: 'always',
    routeType: 'static',
  },

  // ============= CUSTOMER MANAGEMENT =============
  {
    label: 'Customers Management',
    icon: 'shop',
    collapseId: 'customersNav',
    roles: ['admin', 'manager'],
    displayCondition: 'always',
    routeType: 'static',
    children: [
      {
        label: 'Customers List',
        route: '/admin/customers',
        displayCondition: 'always',
        routeType: 'static',
      },
      {
        label: 'New Customer Request',
        route: '/admin/customers/add-customer',
        displayCondition: 'always',
        routeType: 'static',
      },
    ],
  },

  // ============= RESTAURANT MANAGEMENT =============
  {
    label: 'Restaurant Management',
    icon: 'shop',
    collapseId: 'restaurantNav',
    roles: ['admin', 'manager'],
    displayCondition: 'always',
    routeType: 'static',
    children: [
      {
        label: 'Restaurant List',
        route: '/admin/restaurants',
        displayCondition: 'always',
        routeType: 'static',
      },
      {
        label: 'New Restaurant Request',
        route: '/admin/restaurants/add-restaurant',
        displayCondition: 'always',
        routeType: 'static',
      },
    ],
  },

  // ============= FRANCHISE MANAGEMENT =============
  {
    label: 'Franchise Management',
    icon: 'shop',
    collapseId: 'franchiseNav',
    roles: ['admin', 'manager'],
    displayCondition: 'always',
    routeType: 'static',
    children: [
      {
        label: 'Franchise List',
        route: '/admin/franchises',
        displayCondition: 'always',
        routeType: 'static',
      },
      {
        label: 'Add Franchise',
        route: '/admin/franchises/add-franchise',
        displayCondition: 'always',
        routeType: 'static',
      },
    ],
  },

  // ============= GLOBAL RIDER MANAGEMENT (Static - only shows when no specific context) =============
  // {
  //   label: 'Global Rider Management',
  //   icon: 'bike',
  //   collapseId: 'globalRiderNav',
  //   roles: ['admin'],
  //   displayCondition: 'always', // You might want to change this to show only when no context is selected
  //   routeType: 'static',
  //   children: [
  //     {
  //       label: 'All Riders Overview',
  //       route: '/admin/riders', // This would be a new route for global rider overview
  //       displayCondition: 'always',
  //       routeType: 'static',
  //     },
  //     {
  //       label: 'Global Rider Shifts',
  //       route: '/admin/riders/shifts',
  //       displayCondition: 'always',
  //       routeType: 'static',
  //     },
  //   ],
  // },

  // ============= ORDER MANAGEMENT (GLOBAL) =============
  {
    label: 'Order Management',
    icon: 'books',
    collapseId: 'ordernav',
    roles: ['admin', 'manager'],
    displayCondition: 'franchise-list-page',
    routeType: 'static',
    children: [
      {
        label: 'Orders',
        route: '/admin/orders',
        displayCondition: 'franchise-list-page',
        routeType: 'static',
      },
      {
        label: 'Order History',
        route: '/admin/orders/order-history',
        displayCondition: 'franchise-list-page',
        routeType: 'static',
      },
      {
        label: 'Example Menu',
        route: '/admin/orders/example-menu',
        displayCondition: 'franchise-list-page',
        routeType: 'static',
      },
    ],
  },

  // ============= ADVERTISEMENT =============
  {
    label: 'Advertisement',
    icon: 'advertisement',
    collapseId: 'advertnav',
    roles: ['admin'],
    displayCondition: 'always',
    routeType: 'static',
    children: [
      {
        label: 'Ads List',
        route: '/admin/ads',
        displayCondition: 'always',
        routeType: 'static',
      },
      {
        label: 'New Ad',
        route: '/admin/ads/new',
        displayCondition: 'always',
        routeType: 'static',
      },
    ],
  },

  // ============= EMPLOYEE MANAGEMENT =============
  {
    label: 'Employee Management',
    icon: 'people',
    roles: ['admin'],
    displayCondition: 'always',
    routeType: 'static',
    children: [
      {
        label: 'Employee List',
        route: '/admin/employees',
        displayCondition: 'always',
        routeType: 'static',
      },
      {
        label: 'Add Employee',
        route: '/admin/employees/add',
        displayCondition: 'always',
        routeType: 'static',
      },
    ],
  },

  // ============= RESTAURANT FOOD MENU (Dynamic - shows when restaurant selected) =============
  {
    label: 'Restaurant Food Menu',
    icon: 'pizza',
    collapseId: 'restaurantFoodMenu',
    roles: ['admin', 'manager'],
    displayCondition: 'restaurant-selected',
    routeType: 'dynamic',
    children: [
      {
        label: 'Menu List',
        route: '/admin/restaurants/:id/food-list',
        displayCondition: 'restaurant-selected',
        routeType: 'dynamic',
      },
      {
        label: 'Add New Food',
        route: '/admin/restaurants/:id/food-list/add-food',
        displayCondition: 'restaurant-selected',
        routeType: 'dynamic',
      },
      {
        label: 'Categories',
        route: '/admin/restaurants/:id/categories',
        displayCondition: 'restaurant-selected',
        routeType: 'dynamic',
      },
      {
        label: 'Extras',
        route: '/admin/restaurants/:id/extras',
        displayCondition: 'restaurant-selected',
        routeType: 'dynamic',
      },
    ],
  },

  // ============= RESTAURANT RIDERS (Dynamic - shows when restaurant selected) =============
  {
    label: 'Restaurant Riders',
    icon: 'bike',
    collapseId: 'restaurantRiders',
    roles: ['admin', 'manager'],
    displayCondition: 'restaurant-selected',
    routeType: 'dynamic',
    children: [
      {
        label: 'Riders List',
        route: '/admin/restaurants/:id/riders',
        displayCondition: 'restaurant-selected',
        routeType: 'dynamic',
      },
      {
        label: 'Add Rider',
        route: '/admin/restaurants/:id/riders/add-rider',
        displayCondition: 'restaurant-selected',
        routeType: 'dynamic',
      },
      {
        label: 'Rider Shifts',
        route: '/admin/restaurants/:id/riders/shifts',
        displayCondition: 'restaurant-selected',
        routeType: 'dynamic',
      },
    ],
  },

  // ============= BRANCH FOOD MENU (Dynamic - shows when branch selected) =============
  {
    label: 'Branch Food Menu',
    icon: 'pizza',
    collapseId: 'branchFoodMenu',
    roles: ['admin', 'manager'],
    displayCondition: 'branch-selected',
    routeType: 'dynamic',
    children: [
      {
        label: 'Branch Menu List',
        route: '/admin/franchises/:franchiseId/branches/:branchId/food-list',
        displayCondition: 'branch-selected',
        routeType: 'dynamic',
      },
      {
        label: 'Branch Categories',
        route: '/admin/franchises/:franchiseId/branches/:branchId/categories',
        displayCondition: 'branch-selected',
        routeType: 'dynamic',
      },
      {
        label: 'Branch Extras',
        route: '/admin/franchises/:franchiseId/branches/:branchId/extras',
        displayCondition: 'branch-selected',
        routeType: 'dynamic',
      },
    ],
  },

  // ============= BRANCH RIDERS (Dynamic - shows when branch selected) =============
  {
    label: 'Branch Riders',
    icon: 'bike',
    collapseId: 'branchRiders',
    roles: ['admin', 'manager'],
    displayCondition: 'branch-selected',
    routeType: 'dynamic',
    children: [
      {
        label: 'Branch Riders List',
        route: '/admin/franchises/:franchiseId/branches/:branchId/riders',
        displayCondition: 'branch-selected',
        routeType: 'dynamic',
      },
      {
        label: 'Add Branch Rider',
        route:
          '/admin/franchises/:franchiseId/branches/:branchId/riders/add-rider',
        displayCondition: 'branch-selected',
        routeType: 'dynamic',
      },
      {
        label: 'Branch Rider Shifts',
        route:
          '/admin/franchises/:franchiseId/branches/:branchId/riders/shifts',
        displayCondition: 'branch-selected',
        routeType: 'dynamic',
      },
    ],
  },

  // ============= BRANCH ORDERS (Dynamic - shows when branch selected) =============
  {
    label: 'Branch Orders',
    icon: 'books',
    collapseId: 'branchOrders',
    roles: ['admin', 'manager'],
    displayCondition: 'branch-selected',
    routeType: 'dynamic',
    children: [
      {
        label: 'Branch Order List',
        route: '/admin/franchises/:franchiseId/branches/:branchId/orders',
        displayCondition: 'branch-selected',
        routeType: 'dynamic',
      },
      {
        label: 'Branch Order History',
        route:
          '/admin/franchises/:franchiseId/branches/:branchId/order-history',
        displayCondition: 'branch-selected',
        routeType: 'dynamic',
      },
    ],
  },

  // ============= FRANCHISE ORDERS (Dynamic - shows when franchise selected) =============
  {
    label: 'Franchise Orders',
    icon: 'books',
    collapseId: 'franchiseOrders',
    roles: ['admin', 'manager'],
    displayCondition: 'franchise-selected',
    routeType: 'dynamic',
    children: [
      {
        label: 'All Franchise Orders',
        route: '/admin/franchises/:franchiseId/orders',
        displayCondition: 'franchise-selected',
        routeType: 'dynamic',
      },
      {
        label: 'Franchise Branches',
        route: '/admin/franchises/:franchiseId/branches',
        displayCondition: 'franchise-selected',
        routeType: 'dynamic',
      },
    ],
  },

  // ============= USER OVERVIEW (for different role) =============
  {
    label: 'Overview',
    icon: 'dashboard',
    roles: ['user'],
    displayCondition: 'always',
    routeType: 'static',
  },
];
