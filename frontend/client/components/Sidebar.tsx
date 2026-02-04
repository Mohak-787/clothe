import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  ShoppingBag,
  Tag,
  ShoppingCart,
  Users,
  Package,
  Zap,
  BarChart3,
  CreditCard,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  {
    label: "Dashboard",
    path: "/",
    icon: <LayoutDashboard className="w-5 h-5" />,
  },
  {
    label: "Products",
    path: "/products",
    icon: <ShoppingBag className="w-5 h-5" />,
  },
  {
    label: "Categories",
    path: "/categories",
    icon: <Tag className="w-5 h-5" />,
  },
  {
    label: "Orders",
    path: "/orders",
    icon: <ShoppingCart className="w-5 h-5" />,
  },
  {
    label: "Customers",
    path: "/customers",
    icon: <Users className="w-5 h-5" />,
  },
  {
    label: "Inventory",
    path: "/inventory",
    icon: <Package className="w-5 h-5" />,
  },
  {
    label: "Discounts",
    path: "/discounts",
    icon: <Zap className="w-5 h-5" />,
  },
  {
    label: "Analytics",
    path: "/analytics",
    icon: <BarChart3 className="w-5 h-5" />,
  },
  {
    label: "Payments",
    path: "/payments",
    icon: <CreditCard className="w-5 h-5" />,
  },
  {
    label: "Settings",
    path: "/settings",
    icon: <Settings className="w-5 h-5" />,
  },
];

export default function Sidebar() {
  const location = useLocation();

  return (
    <aside className="w-64 h-screen bg-[#ede6dd] border-r border-[#d4cbc0] flex flex-col">
      {/* Logo */}
      <div className="px-6 py-6 border-b border-[#d4cbc0]">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-8 h-8 bg-[#c9a876] rounded flex items-center justify-center">
            <span className="text-white font-bold text-sm">FA</span>
          </div>
          <span className="font-semibold text-[#2d2d2d]">Fashion Admin</span>
        </div>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 px-4 py-6 overflow-y-auto space-y-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                isActive
                  ? "bg-[#c9a876] text-white"
                  : "text-[#5a5a5a] hover:bg-[#ddd0c4]"
              )}
            >
              {item.icon}
              <span className="text-sm font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
