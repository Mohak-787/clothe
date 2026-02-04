import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Sidebar from "@/components/Sidebar";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import PlaceholderPage from "./pages/PlaceholderPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AppLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="flex h-screen bg-white">
    <Sidebar />
    {children}
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <AppLayout>
                <Dashboard />
              </AppLayout>
            }
          />
          <Route
            path="/products"
            element={
              <AppLayout>
                <Products />
              </AppLayout>
            }
          />
          <Route
            path="/categories"
            element={
              <AppLayout>
                <PlaceholderPage title="Categories" />
              </AppLayout>
            }
          />
          <Route
            path="/orders"
            element={
              <AppLayout>
                <PlaceholderPage title="Orders" />
              </AppLayout>
            }
          />
          <Route
            path="/customers"
            element={
              <AppLayout>
                <PlaceholderPage title="Customers" />
              </AppLayout>
            }
          />
          <Route
            path="/inventory"
            element={
              <AppLayout>
                <PlaceholderPage title="Inventory" />
              </AppLayout>
            }
          />
          <Route
            path="/discounts"
            element={
              <AppLayout>
                <PlaceholderPage title="Discounts" />
              </AppLayout>
            }
          />
          <Route
            path="/analytics"
            element={
              <AppLayout>
                <PlaceholderPage title="Analytics" />
              </AppLayout>
            }
          />
          <Route
            path="/payments"
            element={
              <AppLayout>
                <PlaceholderPage title="Payments" />
              </AppLayout>
            }
          />
          <Route
            path="/settings"
            element={
              <AppLayout>
                <PlaceholderPage title="Settings" />
              </AppLayout>
            }
          />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
