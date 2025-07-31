import React, { useState } from 'react';
import { Star, Leaf, Tag } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FoodItem } from '@/types/food';
import { useOrder } from '@/context/OrderContext';

interface FoodCardProps {
  item: FoodItem;
}

const FoodCard: React.FC<FoodCardProps> = ({ item }) => {
  const { setSelectedItem, setIsOrderModalOpen } = useOrder();
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  const handleOrderClick = () => {
    setSelectedItem(item);
    setIsOrderModalOpen(true);
  };

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  const handleImageError = () => {
    setImageLoading(false);
    setImageError(true);
  };

  return (
    <Card className="group cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 overflow-hidden border-0 shadow-md">
      <div className="relative overflow-hidden">
        {imageLoading && (
          <div className="w-full h-48 bg-muted animate-pulse flex items-center justify-center">
            <div className="text-muted-foreground text-sm">Loading...</div>
          </div>
        )}
        {!imageError && (
          <img
            src={item.image}
            alt={item.name}
            className={`w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105 ${
              imageLoading ? 'hidden' : ''
            }`}
            onLoad={handleImageLoad}
            onError={handleImageError}
          />
        )}
        {imageError && (
          <div className="w-full h-48 bg-muted flex items-center justify-center">
            <div className="text-muted-foreground text-sm text-center">
              <div className="text-2xl mb-2">🍽️</div>
              Image not available
            </div>
          </div>
        )}
        <div className="absolute top-3 left-3 flex gap-2 flex-wrap">
          {item.isVeg && (
            <div className="bg-green-600 text-white p-1.5 rounded-full shadow-sm">
              <Leaf className="h-3 w-3" />
            </div>
          )}
          {item.isOffer && (
            <div className="bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 shadow-sm">
              <Tag className="h-3 w-3" />
              Offer
            </div>
          )}
          {item.rating && (
            <div className="bg-primary text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 shadow-sm">
              <Star className="h-3 w-3 fill-current" />
              {item.rating}
            </div>
          )}
        </div>
      </div>
      
      <CardContent className="p-4 space-y-4">
        <div className="space-y-2">
          <h3 className="font-bold text-lg text-card-foreground leading-tight">{item.name}</h3>
          <p className="text-muted-foreground text-sm line-clamp-2 leading-relaxed">{item.description}</p>
          <p className="text-xs text-muted-foreground">{item.category}</p>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="text-xl font-bold text-primary">
            ₹{item.price}
          </div>
          <Button 
            onClick={handleOrderClick}
            className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold px-6 py-2 rounded-lg shadow-md transition-all duration-200"
          >
            Order Now
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default FoodCard;