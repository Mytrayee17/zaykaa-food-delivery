import { useState, useEffect } from 'react';
import { FoodItem } from '@/types/food';
import { foodItems as defaultFoodItems } from '@/data/foodItems';

const STORAGE_KEY = 'zaykaaMenu';

export const useMenuData = () => {
  const [menuItems, setMenuItems] = useState<FoodItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Load menu items from localStorage or use defaults
  useEffect(() => {
    const savedItems = localStorage.getItem(STORAGE_KEY);
    if (savedItems) {
      try {
        setMenuItems(JSON.parse(savedItems));
      } catch (error) {
        console.error('Error loading menu from localStorage:', error);
        setMenuItems(defaultFoodItems);
      }
    } else {
      setMenuItems(defaultFoodItems);
    }
    setLoading(false);
  }, []);

  // Save to localStorage whenever menuItems change
  const saveToStorage = (items: FoodItem[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
      setMenuItems(items);
    } catch (error) {
      console.error('Error saving menu to localStorage:', error);
    }
  };

  const addMenuItem = (item: Omit<FoodItem, 'id'>) => {
    // Check for duplicate item names (case-insensitive)
    const isDuplicate = menuItems.some(existingItem => 
      existingItem.name.toLowerCase().trim() === item.name.toLowerCase().trim()
    );
    
    if (isDuplicate) {
      throw new Error(`An item with the name "${item.name}" already exists. Please use a different name.`);
    }

    const newItem: FoodItem = {
      ...item,
      id: Date.now().toString() // Simple ID generation
    };
    const updatedItems = [...menuItems, newItem];
    saveToStorage(updatedItems);
  };

  const updateMenuItem = (id: string, updatedItem: Partial<FoodItem>) => {
    const updatedItems = menuItems.map(item =>
      item.id === id ? { ...item, ...updatedItem } : item
    );
    saveToStorage(updatedItems);
  };

  const deleteMenuItem = (id: string) => {
    // Show confirmation dialog
    const confirmed = window.confirm('Delete this item? This action cannot be undone.');
    if (confirmed) {
      const updatedItems = menuItems.filter(item => item.id !== id);
      saveToStorage(updatedItems);
    }
  };

  const resetToDefaults = () => {
    saveToStorage(defaultFoodItems);
  };

  return {
    menuItems,
    loading,
    addMenuItem,
    updateMenuItem,
    deleteMenuItem,
    resetToDefaults
  };
};