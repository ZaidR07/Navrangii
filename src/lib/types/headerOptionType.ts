export interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
  badge?: number;
  isNew?: boolean;
}