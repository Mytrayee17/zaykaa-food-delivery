import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Minus, Plus, Star, Leaf, MessageCircle, Tag } from 'lucide-react';
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

  const handleWhatsAppOrder = () => {
    const orderText = `Hi! I'd like to order:\n\n${selectedItem.name} x ${quantity}\nPrice: ₹${selectedItem.price * quantity}\n\nPlease confirm my order and delivery details.`;
    const whatsappUrl = `https://wa.me/918639378049?text=${encodeURIComponent(orderText)}`;
    window.open(whatsappUrl, '_blank');
    
    addToOrder(selectedItem, quantity);
    setIsOrderModalOpen(false);
    setQuantity(1);
    
    toast({
      title: "Order sent!",
      description: "Your order has been sent via WhatsApp. We'll confirm shortly.",
    });
  };

  const totalPrice = selectedItem.price * quantity;

  return (
    <Dialog open={isOrderModalOpen} onOpenChange={setIsOrderModalOpen}>
      <DialogContent className="max-w-md mx-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Order Details</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Item Image */}
          <div className="relative overflow-hidden rounded-lg">
            <img
              src={selectedItem.image}
              alt={selectedItem.name}
              className="w-full h-48 object-cover"
            />
            <div className="absolute top-3 left-3 flex gap-2">
              {selectedItem.isVeg && (
                <Badge variant="secondary" className="bg-food-secondary text-white">
                  <Leaf className="h-3 w-3 mr-1" />
                  Veg
                </Badge>
              )}
              {selectedItem.isOffer && (
                <Badge variant="secondary" className="bg-orange-500 text-white">
                  <Tag className="h-3 w-3 mr-1" />
                  Offer
                </Badge>
              )}
              {selectedItem.rating && (
                <Badge variant="secondary" className="bg-primary text-white">
                  <Star className="h-3 w-3 mr-1 fill-current" />
                  {selectedItem.rating}
                </Badge>
              )}
            </div>
          </div>

          {/* Item Details */}
          <div>
            <h3 className="text-xl font-semibold mb-2">{selectedItem.name}</h3>
            <p className="text-muted-foreground mb-2">{selectedItem.description}</p>
            <Badge variant="outline">{selectedItem.category}</Badge>
          </div>

          {/* Quantity Selector */}
          <div className="flex items-center justify-between p-4 bg-secondary rounded-lg">
            <span className="font-medium">Quantity</span>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleQuantityChange(-1)}
                disabled={quantity <= 1}
                className="h-8 w-8"
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="font-semibold text-lg min-w-[2rem] text-center">
                {quantity}
              </span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleQuantityChange(1)}
                className="h-8 w-8"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Price Summary */}
          <div className="bg-gradient-primary text-white p-4 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <span>Price per item:</span>
              <span>₹{selectedItem.price}</span>
            </div>
            <div className="flex justify-between items-center font-bold text-lg">
              <span>Total:</span>
              <span>₹{totalPrice}</span>
            </div>
          </div>

          {/* WhatsApp Order Button */}
          <Button
            onClick={handleWhatsAppOrder}
            className="w-full bg-whatsapp hover:bg-whatsapp/90 text-white py-3 text-lg font-semibold"
            size="lg"
          >
            <MessageCircle className="mr-2 h-5 w-5" />
            Message Zaykaa Food Delivery on WhatsApp
          </Button>
          
          <p className="text-center text-xs text-muted-foreground">
            Your order will be sent via WhatsApp for quick confirmation
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OrderModal;