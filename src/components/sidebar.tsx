import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Menu, ChevronLeft, LayoutDashboard, Users, Package, ShoppingCart,
  CreditCard, MessageCircleWarning, Truck, Tag, Settings, Bell, User, BadgeIndianRupee
} from "lucide-react";
import { usePathname } from "next/navigation";
import { NavItem } from "@/lib/types/headerOptionType";

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  defaultCollapsed?: boolean;
}

export default function Sidebar({ isOpen, setIsOpen, defaultCollapsed = false }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(defaultCollapsed);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const pathname = usePathname();
  const sidebarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.innerWidth < 768) setCollapsed(true);
    const onResize = () => setCollapsed(window.innerWidth < 768);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        isOpen &&
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, setIsOpen]);

  const navItems: NavItem[] = [
    { href: "/dashboard", label: "Dashboard", icon: <LayoutDashboard className="h-5 w-5" /> },
    { href: "/customers", label: "Customers", icon: <Users className="h-5 w-5" /> },
    { href: "/marketing", label: "Marketing", icon: <BadgeIndianRupee className="h-5 w-5" /> },
    { href: "/products", label: "Products", icon: <Package className="h-5 w-5" /> },
    { href: "/orders", label: "Orders", icon: <ShoppingCart className="h-5 w-5" /> },
    { href: "/payments", label: "Payments", icon: <CreditCard className="h-5 w-5" /> },
    { href: "/reports", label: "Reports", icon: <MessageCircleWarning className="h-5 w-5" /> },
    { href: "/shipments", label: "Shipments", icon: <Truck className="h-5 w-5" /> },
    { href: "/coupons", label: "Coupons", icon: <Tag className="h-5 w-5" /> },
  ];

  const secondaryItems: NavItem[] = [
    { href: "/settings", label: "Settings", icon: <Settings className="h-5 w-5" /> },
    { href: "/notifications", label: "Notifications", icon: <Bell className="h-5 w-5" /> },
    { href: "/profile", label: "Profile", icon: <User className="h-5 w-5" /> },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/60 z-40 md:hidden" />
      )}

      {/* Mobile Menu Toggle */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed left-4 top-4 z-50 md:hidden bg-purple-600 text-white p-2 rounded-lg shadow-lg"
      >
        <Menu />
      </button>

      {/* Sidebar */}
      <aside
        ref={sidebarRef}
        className={`
          fixed md:relative z-50 top-0 left-0 h-screen flex flex-col
          transition-all duration-300 ease-in-out
          border-r border-slate-200 dark:border-slate-700
          bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900
          shadow-xl md:shadow-md
          ${collapsed ? "w-20" : "w-60"}
          ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        <header className={`flex items-center h-20 px-6 border-b border-slate-200 dark:border-slate-700 ${collapsed ? "justify-center" : "justify-between"}`}>
          {!collapsed && (
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-purple-600 rounded-lg flex items-center justify-center text-white shadow">
                <Package className="h-5 w-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold text-purple-700">Admin</span>
                <span className="text-xs text-gray-500">Dashboard</span>
              </div>
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden md:flex items-center justify-center w-8 h-8 rounded-md border border-slate-300 dark:border-slate-600"
          >
            <ChevronLeft className={`h-4 w-4 ${collapsed ? "rotate-180" : ""}`} />
          </button>
        </header>

        <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
          <div className="space-y-2">
            {navItems.map((item) => (
              <NavLink
                key={item.href}
                {...item}
                isActive={pathname === item.href}
                isCollapsed={collapsed}
                onHover={setHoveredItem}
                isHovered={hoveredItem === item.href}
              />
            ))}
          </div>
          <div className="space-y-2">
            {secondaryItems.map((item) => (
              <NavLink
                key={item.href}
                {...item}
                isActive={pathname === item.href}
                isCollapsed={collapsed}
                onHover={setHoveredItem}
                isHovered={hoveredItem === item.href}
              />
            ))}
          </div>
        </nav>

      </aside>
    </>
  );
}

interface NavLinkProps extends NavItem {
  isActive: boolean;
  isCollapsed: boolean;
  onHover: (href: string | null) => void;
  isHovered: boolean;
}

function NavLink({ href, label, icon, isActive, isCollapsed, onHover, isHovered }: NavLinkProps) {
  return (
    <div className="relative group">
      <Link
        href={href}
        onMouseEnter={() => onHover(href)}
        onMouseLeave={() => onHover(null)}
        className={`
          flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200
          ${isCollapsed ? "justify-center" : ""}
          ${isActive ? "bg-purple-100 text-purple-700" : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"}
        `}
      >
        {icon}
        {!isCollapsed && <span>{label}</span>}
      </Link>
      {isCollapsed && isHovered && (
        <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 bg-black text-white px-2 py-1 rounded text-sm shadow">
          {label}
        </div>
      )}
    </div>
  );
}
