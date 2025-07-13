export interface SidebarItem {
  label: string;
  icon?: string; // ✅ made optional for child items
  route?: string;
  collapseId?: string;
  roles?: string[];
  children?: SidebarItem[];
}

export const SIDEBAR_ITEMS: SidebarItem[] = [
  {
    label: 'Dashboard',
    icon: 'dashboard',
    route: '/admin/dashboard',
    roles: ['admin', 'manager', 'employee'],
  },
  {
    label: 'Customers Management',
    icon: 'shop',
    collapseId: 'customersNav',
    roles: ['admin', 'manager'],
    children: [
      { label: 'Customers List', route: '/admin/customers' },
      { label: 'New Customer Request', route: '/admin/customers/add-customer' },
    ],
  },
  {
    label: 'Restaurant Management',
    icon: 'shop',
    collapseId: 'restaurantNav',
    roles: ['admin', 'manager'],
    children: [
      { label: 'Restaurant List', route: '/admin/restaurants' },
      {
        label: 'New Restaurant Request',
        route: '/admin/restaurants/add-restaurant',
      },
    ],
  },
  {
    label: 'Rider Management',
    icon: 'bike',
    route: '/',
    roles: ['admin'],
  },
  {
    label: 'Order Management',
    icon: 'books',
    collapseId: 'ordernav',
    roles: ['admin', 'manager'],
    children: [
      { label: 'Orders', route: '/admin/orders' },
      { label: 'New Order Request', route: '/admin/orders/new' },
    ],
  },
  {
    label: 'Advertisement',
    icon: 'advertisement',
    collapseId: 'advertnav',
    roles: ['admin'],
    children: [
      { label: 'Ads List', route: '/admin/ads' },
      { label: 'New Ad', route: '/admin/ads/new' },
    ],
  },
  {
    label: 'Employee Management',
    icon: 'people',
    route: '/',
    roles: ['admin'],
  },
  {
    label: 'Overview',
    icon: 'dashboard',
    roles: ['user'],
  },
  {
    label: 'Food Menu',
    icon: 'pizza',
    collapseId: 'foodMenu',
    roles: ['admin', 'manager'],
    children: [
      { label: 'Menu List', route: '/admin/restaurants/:id/food-list' },
      {
        label: 'Add New Food',
        route: '/admin/restaurants/:id/food-list/add-food',
      },
      {
        label: 'Categories',
        route: '/admin/restaurants/:id/categories',
      },
      {
        label: 'Extras',
        route: '/admin/restaurants/:id/extras',
      },
    ],
  },
];
