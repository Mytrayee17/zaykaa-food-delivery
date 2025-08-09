import React from 'react';
import { MapPin, Clock, Shield, LogOut, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLocationService } from '@/hooks/useLocationService';
import { useAdmin } from '@/context/AdminContext';
import zaykaLogo from '@/assets/zaykaa-logo.png';
import { useOrder } from '@/context/OrderContext';

const Header: React.FC = () => {
  const { serviceArea } = useLocationService();
  const { isAdmin, openLoginModal, logout } = useAdmin();
  const { setIsCartOpen, orderItems } = useOrder();
  const itemCount = orderItems.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <header className="bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg relative">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo and Brand */}
          <div className="flex items-center gap-3">
            <img 
              src={zaykaLogo} 
              alt="Zaykaa Logo" 
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl shadow-lg"
            />
            <div className="min-w-0">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold truncate">Zaykaa</h1>
              <p className="text-white/90 text-xs sm:text-sm truncate">Delicious food delivered</p>
              <div className="flex items-center gap-1 text-xs">
                <MapPin className="h-3 w-3 flex-shrink-0" />
                <span className="truncate">Delivering to: {serviceArea}</span>
              </div>
            </div>
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4" />
              <span>30-45 mins delivery</span>
            </div>
            <Button
              size="sm"
              variant="secondary"
              className="relative text-sm font-semibold"
              onClick={() => setIsCartOpen(true)}
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              Cart
              {itemCount > 0 && (
                <span className="ml-2 inline-flex items-center justify-center rounded-full bg-orange-600 text-white text-xs h-5 px-2">
                  {itemCount}
                </span>
              )}
            </Button>
            {isAdmin && (
              <Button
                size="sm"
                variant="destructive"
                onClick={logout}
                className="text-sm font-semibold"
              >
                <LogOut className="h-4 w-4 mr-1" />
                Logout
              </Button>
            )}
          </div>

          {/* Mobile Actions */}
          <div className="flex md:hidden items-center gap-2">
            <div className="flex items-center gap-1 text-xs bg-white/10 px-2 py-1 rounded-full">
              <Clock className="h-3 w-3" />
              <span>30-45 min</span>
            </div>
            <Button
              size="sm"
              variant="secondary"
              className="relative text-xs px-2 py-1"
              onClick={() => setIsCartOpen(true)}
            >
              <ShoppingCart className="h-3 w-3" />
              {itemCount > 0 && (
                <span className="ml-1 inline-flex items-center justify-center rounded-full bg-orange-600 text-white text-[10px] h-4 px-1.5">
                  {itemCount}
                </span>
              )}
            </Button>
            {isAdmin && (
              <Button
                size="sm"
                variant="destructive"
                onClick={logout}
                className="text-xs px-2 py-1"
              >
                <LogOut className="h-3 w-3" />
              </Button>
            )}
          </div>
        </div>

        {/* Mobile delivery time - full width */}
        <div className="md:hidden flex items-center justify-center gap-2 text-sm mt-3 py-2 bg-white/10 rounded-lg">
          <Clock className="h-4 w-4" />
          <span>30-45 minutes delivery time</span>
        </div>

        {/* Admin Login Button */}
        {!isAdmin && (
          <button
            onClick={openLoginModal}
            aria-label="Admin Login"
            className="absolute top-3 right-3 opacity-40 hover:opacity-80 transition-opacity p-2 rounded-full bg-white/10 hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/50"
            style={{ zIndex: 50 }}
          >
            <Shield className="h-5 w-5" />
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;