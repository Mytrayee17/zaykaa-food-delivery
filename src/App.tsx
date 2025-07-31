import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { OrderProvider } from "@/context/OrderContext";
import { AdminProvider } from "@/context/AdminContext";
import { PrivateAdminRoute } from "@/components/PrivateAdminRoute";
import { AdminLoginModal } from "@/components/AdminLoginModal";
import Index from "./pages/Index";
import MenuPage from "./pages/MenuPage";
import AdminPage from "./pages/AdminPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <AdminProvider>
        <OrderProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <AdminLoginModal />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/menu" element={<MenuPage />} />
              <Route 
                path="/admin" 
                element={
                  <PrivateAdminRoute>
                    <AdminPage />
                  </PrivateAdminRoute>
                } 
              />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </TooltipProvider>
        </OrderProvider>
      </AdminProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
