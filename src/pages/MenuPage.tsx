import React, { useState, useMemo } from 'react';
import Header from '@/components/Header';
import FoodCard from '@/components/FoodCard';
import CategoryFilter from '@/components/CategoryFilter';
import OrderModal from '@/components/OrderModal';
import Footer from '@/components/Footer';
import { useMenuData } from '@/hooks/useMenuData';

const MenuPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { menuItems, loading } = useMenuData();

  const categories = useMemo(() => {
    return Array.from(new Set(menuItems.map(item => item.category)));
  }, [menuItems]);

  const filteredItems = useMemo(() => {
    if (!selectedCategory) return menuItems
    if (selectedCategory === 'Offers') return menuItems.filter(item => item.isOffer)
    return menuItems.filter(item => item.category === selectedCategory)
  }, [selectedCategory, menuItems])

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="text-lg text-muted-foreground">Loading menu...</div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-6">
        {/* Category Filter */}
        <div className="mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-foreground text-center sm:text-left">
            Our Menu
          </h2>
          <CategoryFilter
            categories={categories}
            selectedCategory={selectedCategory}
            onCategorySelect={setSelectedCategory}
          />
        </div>

        {/* Food Grid - Mobile Optimized */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {filteredItems.map((item) => (
            <FoodCard key={item.id} item={item} />
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🍽️</div>
            <p className="text-lg text-muted-foreground mb-2">
              No items found in this category.
            </p>
            <p className="text-sm text-muted-foreground">
              Try selecting a different category or check back later.
            </p>
          </div>
        )}

        {/* Mobile Bottom Spacing */}
        <div className="h-8 sm:hidden"></div>
      </main>

      <OrderModal />
      <Footer />
    </div>
  );
};

export default MenuPage;