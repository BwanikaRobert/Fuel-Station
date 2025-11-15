"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import { useAuth } from "@/lib/auth-context";
import { useUIStore } from "@/lib/store";
import {
  LayoutDashboard,
  Building2,
  FileText,
  TruckIcon,
  Fuel,
  DollarSign,
  PiggyBank,
  Menu,
  X,
  BarChart3,
  Package,
  LucideIcon,
  Landmark,
  IdCard,
  Settings,
  User2,
} from "lucide-react";
import { useTheme } from "next-themes";
import type { User } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { mockGetBranches } from "@/lib/api";

interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
  roles: string[];
}

const navItems: NavItem[] = [
  // Admin Routes
  {
    title: "Dashboard",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
    roles: ["admin"],
  },
  {
    title: "Fuel Deliveries",
    href: "/admin/fuel-deliveries",
    icon: TruckIcon,
    roles: ["admin"],
  },
  {
    title: "Users & Branches",
    href: "/admin/users",
    icon: User2,
    roles: ["admin"],
  },

  {
    title: "Settings",
    href: "/admin/settings",
    icon: Settings,
    roles: ["admin"],
  },

  // Manager Routes
  {
    title: "Dashboard",
    href: "/manager/dashboard",
    icon: LayoutDashboard,
    roles: ["manager"],
  },
  {
    title: "Shift Balancing",
    href: "/manager/shift-balancing",
    icon: Fuel,
    roles: ["manager"],
  },
  {
    title: "Expenses",
    href: "/manager/expenses",
    icon: DollarSign,
    roles: ["manager"],
  },
  {
    title: "Credits",
    href: "/manager/credits",
    icon: IdCard,
    roles: ["manager"],
  },
  {
    title: "Bank Deposits",
    href: "/manager/bank-deposits",
    icon: Landmark,
    roles: ["manager"],
  },
  {
    title: "Inventory",
    href: "/manager/inventory",
    icon: Package,
    roles: ["manager"],
  },

  // Accountant Routes
  {
    title: "Dashboard",
    href: "/accountant/dashboard",
    icon: LayoutDashboard,
    roles: ["accountant"],
  },
  {
    title: "Reports",
    href: "/accountant/reports",
    icon: BarChart3,
    roles: ["accountant"],
  },
];

// Separate component for sidebar content
function SidebarContent({
  user,
  userNavItems,
  pathname,
  onClose,
}: {
  user: User;
  userNavItems: NavItem[];
  pathname: string;
  theme: string | undefined;
  toggleTheme: () => void;
  handleLogout: () => void;
  onClose?: () => void;
}) {
  const { data: branches } = useQuery({
    queryKey: ["branches"],
    queryFn: mockGetBranches,
    enabled: user.role === "admin",
  });

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex h-16 items-center border-b px-6">
        <Fuel className="h-6 w-6 text-primary" />
        <span className="ml-2 text-lg font-bold">Fuel Station</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-4 overflow-y-auto">
        {userNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link key={item.href} href={item.href} onClick={onClose}>
              <Button
                variant={isActive ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start h-12 text-base",
                  isActive && "bg-secondary"
                )}
              >
                <Icon className="mr-3 h-5 w-5" />
                {item.title}
              </Button>
            </Link>
          );
        })}

        {/* Admin Reports Accordion */}
        {user.role === "admin" && (
          <div className="mt-2">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="reports" className="border-none">
                <AccordionTrigger className="hover:no-underline py-3 px-3 hover:bg-accent rounded-md">
                  <div className="flex items-center">
                    <FileText className="mr-3 h-5 w-5" />
                    <span className="text-base font-medium">Reports</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pl-4 pb-2 space-y-1">
                  <Link href="/admin/reports/sales" onClick={onClose}>
                    <Button
                      variant={
                        pathname === "/admin/reports/sales"
                          ? "secondary"
                          : "ghost"
                      }
                      className={cn(
                        "w-full justify-start text-sm h-10",
                        pathname === "/admin/reports/sales" && "bg-secondary"
                      )}
                    >
                      <BarChart3 className="mr-2 h-4 w-4" />
                      Sales Reports
                    </Button>
                  </Link>
                  <Link href="/admin/reports/expenses" onClick={onClose}>
                    <Button
                      variant={
                        pathname === "/admin/reports/expenses"
                          ? "secondary"
                          : "ghost"
                      }
                      className={cn(
                        "w-full justify-start text-sm h-10",
                        pathname === "/admin/reports/expenses" && "bg-secondary"
                      )}
                    >
                      <DollarSign className="mr-2 h-4 w-4" />
                      Expenses Reports
                    </Button>
                  </Link>
                  <Link href="/admin/reports/credits" onClick={onClose}>
                    <Button
                      variant={
                        pathname === "/admin/reports/credits"
                          ? "secondary"
                          : "ghost"
                      }
                      className={cn(
                        "w-full justify-start text-sm h-10",
                        pathname === "/admin/reports/credits" && "bg-secondary"
                      )}
                    >
                      <IdCard className="mr-2 h-4 w-4" />
                      Credits Reports
                    </Button>
                  </Link>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        )}

        {/* Admin Branches Accordion */}
        {user.role === "admin" && branches && branches.length > 0 && (
          <div className="mt-2">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="branches" className="border-none">
                <AccordionTrigger className="hover:no-underline py-3 px-3 hover:bg-accent rounded-md">
                  <div className="flex items-center">
                    <Building2 className="mr-3 h-5 w-5" />
                    <span className="text-base font-medium">Branches</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pl-4 pb-2 space-y-1">
                  {branches.map((branch) => {
                    const branchHref = `/admin/branches/${branch.id}`;
                    const isBranchActive = pathname.startsWith(branchHref);

                    return (
                      <Link key={branch.id} href={branchHref} onClick={onClose}>
                        <Button
                          variant={isBranchActive ? "secondary" : "ghost"}
                          className={cn(
                            "w-full justify-start text-sm h-10",
                            isBranchActive && "bg-secondary"
                          )}
                        >
                          {branch.name}
                        </Button>
                      </Link>
                    );
                  })}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        )}
      </nav>
    </div>
  );
}

export function Sidebar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const { sidebarOpen, setSidebarOpen } = useUIStore();
  const { theme, setTheme } = useTheme();

  if (!user) return null;

  const userNavItems = navItems.filter((item) =>
    item.roles.includes(user.role)
  );

  const handleLogout = () => {
    logout();
    window.location.href = "/login";
  };

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-40 lg:hidden"
        onClick={() => setSidebarOpen(true)}
      >
        <Menu className="h-5 w-5" />
      </Button>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col border-r bg-background">
        <SidebarContent
          user={user}
          userNavItems={userNavItems}
          pathname={pathname}
          theme={theme}
          toggleTheme={toggleTheme}
          handleLogout={handleLogout}
        />
      </aside>

      {/* Mobile Sidebar */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="left" className="w-72 p-0">
          <VisuallyHidden.Root>
            <SheetTitle>Navigation Menu</SheetTitle>
          </VisuallyHidden.Root>
          <SidebarContent
            user={user}
            userNavItems={userNavItems}
            pathname={pathname}
            theme={theme}
            toggleTheme={toggleTheme}
            handleLogout={handleLogout}
            onClose={() => setSidebarOpen(false)}
          />
        </SheetContent>
      </Sheet>
    </>
  );
}
