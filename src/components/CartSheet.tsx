import React, { useMemo } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Minus, Plus, Trash2, MessageCircle } from 'lucide-react';
import { useOrder } from '@/context/OrderContext';
import { useToast } from '@/hooks/use-toast';

const CartSheet: React.FC = () => {
  const {
    isCartOpen,
    setIsCartOpen,
    orderItems,
    updateOrderQuantity,
    removeFromOrder,
    clearOrder,
    getSubtotal,
    getHandlingCharge,
    getGrandTotal,
    buildWhatsAppInvoiceMessage,
  } = useOrder();
  const { toast } = useToast();

  const totalQuantity = useMemo(
    () => orderItems.reduce((sum, item) => sum + item.quantity, 0),
    [orderItems]
  );

  const handleCheckoutWhatsApp = () => {
    if (orderItems.length === 0) return;
    const message = buildWhatsAppInvoiceMessage();
    const whatsappUrl = `https://wa.me/918500157859?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    toast({ title: 'Invoice opened in WhatsApp', description: 'Please confirm the order in WhatsApp. We will follow up shortly.' });
  };

  const subtotal = getSubtotal();
  const handling = getHandlingCharge(subtotal);
  const total = getGrandTotal();

  return (
    <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
      <SheetContent side="right" className="!w-full sm:!max-w-md flex h-full flex-col">
        <div className="p-6 pb-4">
          <SheetHeader>
            <SheetTitle>Your Cart ({totalQuantity})</SheetTitle>
          </SheetHeader>
        </div>

        <div className="flex-1 overflow-y-auto px-6 space-y-4">
          {orderItems.length === 0 ? (
            <div className="text-center text-muted-foreground py-20">Your cart is empty.</div>
          ) : (
            orderItems.map((item) => (
              <div key={item.id} className="flex items-start gap-3 border rounded-lg p-3 bg-background">
                <img src={item.image} alt={item.name} className="w-16 h-16 rounded object-cover" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold truncate">{item.name}</h4>
                    {item.isOffer && (
                      <Badge className="ml-2" variant="secondary">Offer</Badge>
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground truncate">₹{item.price} each</div>
                  <div className="mt-2 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Button aria-label="Decrease quantity" size="icon" variant="outline" className="h-10 w-10 sm:h-8 sm:w-8" onClick={() => updateOrderQuantity(item.id, item.quantity - 1)} disabled={item.quantity <= 1}>
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="font-semibold w-8 text-center text-base sm:text-sm">{item.quantity}</span>
                      <Button aria-label="Increase quantity" size="icon" variant="outline" className="h-10 w-10 sm:h-8 sm:w-8" onClick={() => updateOrderQuantity(item.id, item.quantity + 1)}>
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="font-semibold">₹{item.price * item.quantity}</div>
                      <Button aria-label="Remove item" size="icon" variant="destructive" className="h-10 w-10 sm:h-8 sm:w-8" onClick={() => removeFromOrder(item.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-4 sm:p-6 border-t bg-background space-y-3">
          <div className="border rounded-lg p-4 space-y-2 bg-gray-50">
            <div className="flex justify-between text-sm">
              <span>Subtotal</span>
              <span>₹{subtotal}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Handling charges</span>
              <span>₹{handling}</span>
            </div>
            <div className="flex justify-between font-semibold text-base pt-2 border-t">
              <span>Total</span>
              <span>₹{total}</span>
            </div>
          </div>

          <div className="flex gap-2">
            <Button className="flex-1 bg-green-600 hover:bg-green-700" onClick={handleCheckoutWhatsApp} disabled={orderItems.length === 0}>
              <MessageCircle className="h-5 w-5 mr-2" />
              Checkout via WhatsApp
            </Button>
            <Button variant="outline" onClick={() => { clearOrder(); toast({ title: 'Cart cleared' }); }} disabled={orderItems.length === 0}>
              Clear
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default CartSheet;


