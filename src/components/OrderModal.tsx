import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Minus, Plus, Star, Leaf, MessageCircle, Tag, X } from 'lucide-react';
import { useOrder } from '@/context/OrderContext';
import { useToast } from '@/hooks/use-toast';

const OrderModal: React.FC = () => {
  const {
    selectedItem,
    isOrderModalOpen,
    setIsOrderModalOpen,
    addToOrder,
  } = useOrder();
  
  const [quantity, setQuantity] = useState(1);
  const { toast } = useToast();

  if (!selectedItem) return null;

  const handleQuantityChange = (delta: number) => {
    setQuantity(prev => Math.max(1, prev + delta));
  };

  const handleAddToCart = () => {
    addToOrder(selectedItem, quantity);
    setIsOrderModalOpen(false);
    setQuantity(1);
    toast({ title: 'Added to cart', description: `${selectedItem.name} x ${quantity}` });
  };

  const totalPrice = selectedItem.price * quantity;

  return (
    <Dialog open={isOrderModalOpen} onOpenChange={setIsOrderModalOpen}>
      <DialogContent className="max-w-md mx-auto max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader className="relative">
          <DialogTitle className="text-xl font-bold text-center">Order Details</DialogTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOrderModalOpen(false)}
            className="absolute right-0 top-0 h-8 w-8 rounded-full"
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Item Image */}
          <div className="relative overflow-hidden rounded-xl">
            <img
              src={selectedItem.image}
              alt={selectedItem.name}
              className="w-full h-56 sm:h-48 object-cover"
            />
            <div className="absolute top-3 left-3 flex gap-2 flex-wrap">
              {selectedItem.isVeg && (
                <Badge variant="secondary" className="bg-green-600 text-white text-xs px-2 py-1">
                  <Leaf className="h-3 w-3 mr-1" />
                  Veg
                </Badge>
              )}
              {selectedItem.isOffer && (
                <Badge variant="secondary" className="bg-orange-500 text-white text-xs px-2 py-1">
                  <Tag className="h-3 w-3 mr-1" />
                  Offer
                </Badge>
              )}
              {selectedItem.rating && (
                <Badge variant="secondary" className="bg-primary text-white text-xs px-2 py-1">
                  <Star className="h-3 w-3 mr-1 fill-current" />
                  {selectedItem.rating}
                </Badge>
              )}
            </div>
          </div>

          {/* Item Details */}
          <div className="space-y-3">
            <h3 className="text-2xl font-bold text-center">{selectedItem.name}</h3>
            <p className="text-muted-foreground text-center leading-relaxed">{selectedItem.description}</p>
            <div className="flex justify-center">
              <Badge variant="outline" className="text-sm">{selectedItem.category}</Badge>
            </div>
          </div>

          {/* Quantity Selector - Mobile Optimized */}
          <div className="bg-gray-50 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-lg">Quantity</span>
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleQuantityChange(-1)}
                  disabled={quantity <= 1}
                  className="h-12 w-12 rounded-full border-2 hover:bg-gray-100"
                >
                  <Minus className="h-6 w-6" />
                </Button>
                <span className="font-bold text-2xl min-w-[3rem] text-center">
                  {quantity}
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleQuantityChange(1)}
                  className="h-12 w-12 rounded-full border-2 hover:bg-gray-100"
                >
                  <Plus className="h-6 w-6" />
                </Button>
              </div>
            </div>
          </div>

          {/* Price Summary - Mobile Optimized */}
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-6 rounded-xl">
            <div className="flex justify-between items-center mb-3">
              <span className="text-lg">Price per item:</span>
              <span className="text-lg font-semibold">₹{selectedItem.price}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xl font-bold">Total:</span>
              <span className="text-2xl font-bold">₹{totalPrice}</span>
            </div>
          </div>

          {/* Add to Cart Button */}
          <Button
            onClick={handleAddToCart}
            className="w-full bg-orange-600 hover:bg-orange-700 text-white py-4 text-lg font-bold rounded-xl shadow-lg"
            size="lg"
          >
            Add to Cart
          </Button>
          
          <p className="text-center text-sm text-muted-foreground leading-relaxed">
            You can review your cart and checkout via WhatsApp from the cart.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OrderModal;