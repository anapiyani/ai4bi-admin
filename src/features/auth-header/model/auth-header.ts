export type AuthNavItem = {
  id: string;
  label: string;
  href: string;
};

export const AUTH_NAV_ITEMS: AuthNavItem[] = [
  { id: 'auctions', label: 'Тендеры', href: '/auctions' },
  { id: 'analytics', label: 'Аналитика', href: '/analytics' },
];

export function getNavItems(): AuthNavItem[] {
  return AUTH_NAV_ITEMS;
}

