import React, { useState, useEffect, useRef, useCallback, memo } from "react";
import Link from "next/link";
import {
  Menu, ChevronLeft, LayoutDashboard, Users, Package, ShoppingCart,
  CreditCard, MessageCircleWarning, Truck, Tag, Settings, Bell, User, BadgeIndianRupee, UserCheck, RefreshCw, MessageSquare, LogOut, Loader2
} from "lucide-react";
import { usePathname } from "next/navigation";
import { NavItem } from "@/lib/types/headerOptionType";
import { useLogout } from "@/hooks/admin/useLogout";

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  defaultCollapsed?: boolean;
}

export default function Sidebar({ isOpen, setIsOpen, defaultCollapsed = true }: SidebarProps) {
  const { mutate: logout, isPending: isLoggingOut } = useLogout();
  const [collapsed, setCollapsed] = useState(defaultCollapsed);
  const [isHovered, setIsHovered] = useState(false);
  const [isMarketingExpanded, setIsMarketingExpanded] = useState(false);
  const pathname = usePathname();
  const sidebarRef = useRef<HTMLDivElement>(null);

  // Hover to expand sidebar
  const handleMouseEnter = () => {
    if (window.innerWidth >= 768) {
      setIsHovered(true);
      setCollapsed(false);
    }
  };

  const handleMouseLeave = () => {
    if (window.innerWidth >= 768) {
      setIsHovered(false);
      setCollapsed(true);
    }
  };

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

  // Auto-expand Marketing when on campaign page
  useEffect(() => {
    if (pathname.startsWith("/admin/marketing")) {
      setIsMarketingExpanded(true);
    }
  }, [pathname]);

  const navItems: NavItem[] = [
    { href: "/admin/dashboard", label: "Dashboard", icon: <LayoutDashboard className="h-5 w-5" /> },
    { href: "/admin/customers", label: "Customers", icon: <Users className="h-5 w-5" /> },
    { href: "/admin/users", label: "Users", icon: <UserCheck className="h-5 w-5" /> },
    { href: "/admin/products", label: "Products", icon: <Package className="h-5 w-5" /> },
    { href: "/admin/orders", label: "Orders", icon: <ShoppingCart className="h-5 w-5" /> },
    { href: "/admin/cancellation-exchange", label: "Cancellation & Exchange", icon: <RefreshCw className="h-5 w-5" /> },
    { href: "/admin/payments", label: "Payments", icon: <CreditCard className="h-5 w-5" /> },
    { href: "/admin/coupons", label: "Coupons", icon: <Tag className="h-5 w-5" /> },
  ];

  const secondaryItems: NavItem[] = [
    { href: "/admin/settings", label: "Settings", icon: <Settings className="h-5 w-5" /> },
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
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={`
          fixed md:relative z-50 top-0 left-0 h-screen flex flex-col
          transition-all duration-150 ease-out
          border-r border-slate-200 dark:border-slate-700
          bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900
          
          ${collapsed ? "w-20" : "w-60"}
          ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        <header className={`flex items-center h-20 px-6 border-b border-slate-200 dark:border-slate-700 ${collapsed ? "justify-center" : "justify-between"}`}>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-purple-600 rounded-lg flex items-center justify-center text-white shadow">
              <Package className="h-5 w-5" />
            </div>
            {!collapsed && (
              <div className="flex flex-col">
                <span className="text-xl font-bold text-purple-700 dark:text-purple-400 leading-tight">Admin</span>
                <span className="text-[10px] text-gray-500 dark:text-slate-400 uppercase tracking-wider">Dashboard</span>
              </div>
            )}
          </div>
        </header>

        <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
          <div className="space-y-2">
            {/* Dashboard */}
            <NavLink
              href="/admin/dashboard"
              label="Dashboard"
              icon={<LayoutDashboard className="h-5 w-5" />}
              isActive={pathname === "/admin/dashboard"}
              isCollapsed={collapsed}
            />

            {/* Customers */}
            <NavLink
              href="/admin/customers"
              label="Customers"
              icon={<Users className="h-5 w-5" />}
              isActive={pathname === "/admin/customers"}
              isCollapsed={collapsed}
            />

            {/* Marketing (Expandable) */}
            {collapsed ? (
              <NavLink
                href="/admin/marketing/whatsapp/campaign"
                label="Marketing"
                icon={<BadgeIndianRupee className="h-5 w-5" />}
                isActive={pathname.startsWith("/admin/marketing")}
                isCollapsed={collapsed}
              />
            ) : (
              <div className="space-y-1">
                <button
                  onClick={() => setIsMarketingExpanded((v) => !v)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 text-left ${
                    pathname.startsWith("/admin/marketing")
                      ? "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300"
                      : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                  }`}
                >
                  <BadgeIndianRupee className="h-5 w-5" />
                  <span className="flex-1">Marketing</span>
                </button>

                {isMarketingExpanded && (
                  <div className="ml-4 pl-3 border-l border-slate-200 dark:border-slate-700 space-y-1">
                    <Link
                      href="/admin/marketing/whatsapp/campaign"
                      className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                        pathname === "/admin/marketing/whatsapp/campaign"
                          ? "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300"
                          : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                      }`}
                    >
                      Campaign
                    </Link>
                  </div>
                )}
              </div>
            )}

            {/* Remaining nav items */}
            {[
              { href: "/admin/users", label: "Users", icon: <UserCheck className="h-5 w-5" /> },
              { href: "/admin/products", label: "Products", icon: <Package className="h-5 w-5" /> },
              { href: "/admin/orders", label: "Orders", icon: <ShoppingCart className="h-5 w-5" /> },
              { href: "/admin/cancellation-exchange", label: "Cancellation & Exchange", icon: <RefreshCw className="h-5 w-5" /> },
              { href: "/admin/payments", label: "Payments", icon: <CreditCard className="h-5 w-5" /> },
              { href: "/admin/coupons", label: "Coupons", icon: <Tag className="h-5 w-5" /> },
            ].map((item) => (
              <NavLink
                key={item.href}
                {...item}
                isActive={pathname === item.href}
                isCollapsed={collapsed}
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
              />
            ))}
          </div>
        </nav>

        {/* Logout */}
        <div className="px-4 py-4 border-t border-slate-200 dark:border-slate-700">
          <button
            onClick={() => logout()}
            disabled={isLoggingOut}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 text-left ${
              collapsed ? "justify-center" : ""
            } text-gray-700 hover:bg-rose-50 hover:text-rose-600 dark:text-gray-300 dark:hover:bg-rose-900/20 dark:hover:text-rose-400`}
          >
            {isLoggingOut ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <LogOut className="h-5 w-5" />
            )}
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>
    </>
  );
}

interface NavLinkProps extends NavItem {
  isActive: boolean;
  isCollapsed: boolean;
}

const NavLink = memo(function NavLink({ href, label, icon, isActive, isCollapsed }: NavLinkProps) {
  return (
    <div className="relative group">
      <Link
        href={href}
        className={`
          flex items-center gap-3 px-3 py-2 rounded-lg transition-colors duration-150
          ${isCollapsed ? "justify-center" : ""}
          ${isActive ? "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300" : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"}
        `}
      >
        {icon}
        {!isCollapsed && <span>{label}</span>}
      </Link>
      {isCollapsed && (
        <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 bg-black text-white px-2 py-1 rounded text-sm shadow opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-150 whitespace-nowrap z-50">
          {label}
        </div>
      )}
    </div>
  );
});
