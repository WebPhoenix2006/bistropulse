// ============= TYPES & INTERFACES =============
export interface SidebarItem {
  label: string;
  icon?: string;
  route?: string;
  collapseId?: string;
  roles?: string[];
  children?: SidebarItem[];
  displayCondition?:
    | 'always'
    | 'restaurant-selected'
    | 'branch-selected'
    | 'franchise-selected'
    | 'franchise-list-page';
  routeType?: 'static' | 'dynamic';
}

export type Role = 'admin' | 'manager' | 'employee' | 'user';

// ============= SIDEBAR CONFIGURATION =============
export const SIDEBAR_ITEMS: SidebarItem[] = [
  // ============= CORE DASHBOARD =============
  {
    label: 'Dashboard',
    icon: 'dashboard',
    route: '/admin/dashboard',
    roles: ['admin', 'manager', 'employee'],
    displayCondition: 'always',
    routeType: 'static',
  },

  // ============= USER OVERVIEW (Special Role) =============
  {
    label: 'Overview',
    icon: 'dashboard',
    route: '/user/overview',
    roles: ['user'],
    displayCondition: 'always',
    routeType: 'static',
  },

  // ============= MANAGEMENT SECTIONS (Static - Always Visible) =============

  // Customer Management
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

  // Restaurant Management
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

  // Franchise Management
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

  // Employee Management
  {
    label: 'Employee Management',
    icon: 'people',
    collapseId: 'employeeNav',
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

  // Advertisement Management
  {
    label: 'Advertisement',
    icon: 'advertisement',
    collapseId: 'advertNav',
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

  // ============= GLOBAL ORDER MANAGEMENT =============
  {
    label: 'Order Management',
    icon: 'books',
    collapseId: 'globalOrderNav',
    roles: ['admin', 'manager'],
    displayCondition: 'franchise-list-page',
    routeType: 'static',
    children: [
      {
        label: 'All Orders',
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

  // ============= RESTAURANT-SPECIFIC SECTIONS (Dynamic) =============

  // Restaurant Food Menu
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

  // Restaurant Orders
  {
    label: 'Restaurant Orders',
    icon: 'books',
    collapseId: 'restaurantOrders',
    roles: ['admin', 'manager'],
    displayCondition: 'restaurant-selected',
    routeType: 'dynamic',
    children: [
      {
        label: 'Order List',
        route: '/admin/restaurants/:id/orders',
        displayCondition: 'restaurant-selected',
        routeType: 'dynamic',
      },
      {
        label: 'Order History',
        route: '/admin/restaurants/:id/order-history',
        displayCondition: 'restaurant-selected',
        routeType: 'dynamic',
      },
    ],
  },

  // Restaurant Riders
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

  // ============= FRANCHISE-SPECIFIC SECTIONS (Dynamic) =============

  // Franchise Orders & Branches
  {
    label: 'Franchise Management',
    icon: 'books',
    collapseId: 'franchiseManagement',
    roles: ['admin', 'manager'],
    displayCondition: 'franchise-selected',
    routeType: 'dynamic',
    children: [
      {
        label: 'Franchise Branches',
        route: '/admin/franchises/:franchiseId/branches',
        displayCondition: 'franchise-selected',
        routeType: 'dynamic',
      },
      {
        label: 'All Franchise Orders',
        route: '/admin/franchises/:franchiseId/orders',
        displayCondition: 'franchise-selected',
        routeType: 'dynamic',
      },
    ],
  },

  // ============= BRANCH-SPECIFIC SECTIONS (Dynamic) =============

  // Branch Food Menu
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

  // Branch Orders
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

  // Branch Riders
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
];

// // ============= UTILITY FUNCTIONS (Optional) =============

// /**
//  * Filter sidebar items based on user role
//  */
// export const filterSidebarByRole = (items: SidebarItem[], userRole: Role): SidebarItem[] => {
//   return items.filter(item =>
//     item.roles?.includes(userRole)
//   ).map(item => ({
//     ...item,
//     children: item.children?.filter(child =>
//       !child.roles || child.roles.includes(userRole)
//     )
//   }));
// };

// /**
//  * Filter sidebar items based on display condition
//  */
// export const filterSidebarByCondition = (
//   items: SidebarItem[],
//   condition: SidebarItem['displayCondition']
// ): SidebarItem[] => {
//   return items.filter(item =>
//     item.displayCondition === 'always' || item.displayCondition === condition
//   );
// };

// /**
//  * Get sidebar items for specific context
//  */
// export const getSidebarForContext = (
//   userRole: Role,
//   context: {
//     selectedRestaurant?: string;
//     selectedFranchise?: string;
//     selectedBranch?: string;
//     isOnFranchiseListPage?: boolean;
//   }
// ) => {
//   let condition: SidebarItem['displayCondition'] = 'always';

//   if (context.selectedBranch) {
//     condition = 'branch-selected';
//   } else if (context.selectedFranchise) {
//     condition = 'franchise-selected';
//   } else if (context.selectedRestaurant) {
//     condition = 'restaurant-selected';
//   } else if (context.isOnFranchiseListPage) {
//     condition = 'franchise-list-page';
//   }

//   const roleFiltered = filterSidebarByRole(SIDEBAR_ITEMS, userRole);
//   return filterSidebarByCondition(roleFiltered, condition);
// };
