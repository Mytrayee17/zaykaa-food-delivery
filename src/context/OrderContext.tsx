import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { FoodItem, OrderItem } from '@/types/food';
import { useLocationService } from '@/hooks/useLocationService';

interface OrderContextType {
  selectedItem: FoodItem | null;
  setSelectedItem: (item: FoodItem | null) => void;
  isOrderModalOpen: boolean;
  setIsOrderModalOpen: (open: boolean) => void;
  orderItems: OrderItem[];
  addToOrder: (item: FoodItem, quantity: number) => void;
  clearOrder: () => void;
  removeFromOrder: (itemId: string) => void;
  updateOrderQuantity: (itemId: string, quantity: number) => void;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const useOrder = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrder must be used within an OrderProvider');
  }
  return context;
};

interface OrderProviderProps {
  children: ReactNode;
}

const ORDER_STORAGE_KEY = 'zaykaa_order_items';

export const OrderProvider: React.FC<OrderProviderProps> = ({ children }) => {
  const [selectedItem, setSelectedItem] = useState<FoodItem | null>(null);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const { checkLocationForOrder } = useLocationService();

  // Load order items from localStorage on mount
  useEffect(() => {
    const savedOrder = localStorage.getItem(ORDER_STORAGE_KEY);
    if (savedOrder) {
      try {
        const parsedOrder = JSON.parse(savedOrder);
        setOrderItems(parsedOrder);
      } catch (error) {
        console.error('Error loading order from localStorage:', error);
        setOrderItems([]);
      }
    }
  }, []);

  // Save order items to localStorage whenever they change
  const saveOrderToStorage = (items: OrderItem[]) => {
    try {
      localStorage.setItem(ORDER_STORAGE_KEY, JSON.stringify(items));
      setOrderItems(items);
    } catch (error) {
      console.error('Error saving order to localStorage:', error);
    }
  };

  const addToOrder = (item: FoodItem, quantity: number) => {
    // Check location before adding to order
    if (!checkLocationForOrder()) {
      return;
    }

    // Validate quantity
    if (quantity <= 0) {
      return;
    }

    setOrderItems(prev => {
      const existingItemIndex = prev.findIndex(orderItem => orderItem.id === item.id);
      
      if (existingItemIndex !== -1) {
        // Update existing item quantity
        const updatedItems = [...prev];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + quantity
        };
        saveOrderToStorage(updatedItems);
        return updatedItems;
      } else {
        // Add new item
        const newOrderItem: OrderItem = { ...item, quantity };
        const updatedItems = [...prev, newOrderItem];
        saveOrderToStorage(updatedItems);
        return updatedItems;
      }
    });
  };

  const removeFromOrder = (itemId: string) => {
    setOrderItems(prev => {
      const updatedItems = prev.filter(item => item.id !== itemId);
      saveOrderToStorage(updatedItems);
      return updatedItems;
    });
  };

  const updateOrderQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromOrder(itemId);
      return;
    }

    setOrderItems(prev => {
      const updatedItems = prev.map(item =>
        item.id === itemId ? { ...item, quantity } : item
      );
      saveOrderToStorage(updatedItems);
      return updatedItems;
    });
  };

  const clearOrder = () => {
    setOrderItems([]);
    localStorage.removeItem(ORDER_STORAGE_KEY);
  };

  // Enhanced setSelectedItem with location check
  const selectItemWithLocationCheck = (item: FoodItem | null) => {
    if (item && !checkLocationForOrder()) {
      return;
    }
    setSelectedItem(item);
    if (item) {
      setIsOrderModalOpen(true);
    }
  };

  return (
    <OrderContext.Provider
      value={{
        selectedItem,
        setSelectedItem: selectItemWithLocationCheck,
        isOrderModalOpen,
        setIsOrderModalOpen,
        orderItems,
        addToOrder,
        clearOrder,
        removeFromOrder,
        updateOrderQuantity,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};