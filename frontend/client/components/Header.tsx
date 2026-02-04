import { Search, Bell } from "lucide-react";
import { Input } from "@/components/ui/input";

interface HeaderProps {
  title?: string;
  breadcrumbs?: { label: string; path?: string }[];
}

export default function Header({ title, breadcrumbs }: HeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200">
      {/* Top Bar */}
      <div className="px-8 py-4 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-[#c9a876] rounded flex items-center justify-center">
            <span className="text-white font-bold text-sm">FA</span>
          </div>
          <span className="font-semibold text-[#2d2d2d]">Fashion Admin</span>
        </div>

        <div className="flex items-center gap-6">
          {/* Search Bar */}
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search products, orders..."
              className="pl-10 bg-gray-50 border-gray-200 text-sm"
            />
          </div>

          {/* Icons */}
          <div className="flex items-center gap-4">
            <button className="relative text-gray-600 hover:text-gray-900">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <div className="flex items-center gap-2 pl-4 border-l border-gray-200">
              <div className="w-8 h-8 bg-[#c9a876] rounded flex items-center justify-center text-white text-xs font-bold">
                AD
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Breadcrumb / Title */}
      {(title || breadcrumbs) && (
        <div className="px-8 py-4">
          {breadcrumbs && (
            <div className="flex items-center gap-2 text-sm mb-3 text-gray-600">
              {breadcrumbs.map((crumb, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  {idx > 0 && <span className="text-gray-400">›</span>}
                  <span>{crumb.label}</span>
                </div>
              ))}
            </div>
          )}
          {title && <h1 className="text-2xl font-semibold text-[#2d2d2d]">{title}</h1>}
        </div>
      )}
    </header>
  );
}
