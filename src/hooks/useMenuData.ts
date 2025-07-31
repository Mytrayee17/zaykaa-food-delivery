import { useState, useEffect } from 'react';
import { FoodItem } from '@/types/food';
import { foodItems as defaultFoodItems } from '@/data/foodItems';

const STORAGE_KEY = 'zaykaaMenu';
const SHARED_STORAGE_KEY = 'zaykaaSharedMenu';
const DEFAULT_STORAGE_KEY = 'zaykaaDefaultMenu';

export const useMenuData = () => {
  const [menuItems, setMenuItems] = useState<FoodItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Load menu items from localStorage or use defaults
  useEffect(() => {
    const loadMenuData = () => {
      // First try to load from shared storage (for cross-user sync)
      const sharedItems = localStorage.getItem(SHARED_STORAGE_KEY);
      if (sharedItems) {
        try {
          const parsedShared = JSON.parse(sharedItems);
          setMenuItems(parsedShared);
          // Also save to local storage for backup
          localStorage.setItem(STORAGE_KEY, sharedItems);
          return;
        } catch (error) {
          console.error('Error loading shared menu:', error);
        }
      }

      // Check for saved default menu
      const savedDefault = localStorage.getItem(DEFAULT_STORAGE_KEY);
      if (savedDefault) {
        try {
          const parsedDefault = JSON.parse(savedDefault);
          setMenuItems(parsedDefault);
          // Also save to local and shared storage
          localStorage.setItem(STORAGE_KEY, savedDefault);
          localStorage.setItem(SHARED_STORAGE_KEY, savedDefault);
          return;
        } catch (error) {
          console.error('Error loading saved default menu:', error);
        }
      }

      // Fallback to local storage
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
    };

    loadMenuData();
    setLoading(false);
  }, []);

  // Save to both local and shared storage for cross-user sync
  const saveToStorage = (items: FoodItem[]) => {
    try {
      const itemsJson = JSON.stringify(items);
      localStorage.setItem(STORAGE_KEY, itemsJson);
      localStorage.setItem(SHARED_STORAGE_KEY, itemsJson);
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

  // Function to sync with shared data (can be called periodically)
  const syncWithSharedData = () => {
    const sharedItems = localStorage.getItem(SHARED_STORAGE_KEY);
    if (sharedItems) {
      try {
        const parsedShared = JSON.parse(sharedItems);
        setMenuItems(parsedShared);
        localStorage.setItem(STORAGE_KEY, sharedItems);
      } catch (error) {
        console.error('Error syncing with shared data:', error);
      }
    }
  };

  // Simple function to save current menu as the new default
  const saveAsDefault = () => {
    try {
      const itemsJson = JSON.stringify(menuItems);
      localStorage.setItem(DEFAULT_STORAGE_KEY, itemsJson);
      alert(`✅ Menu saved as default! All users will now see this updated menu.`);
      return true;
    } catch (error) {
      console.error('Error saving as default:', error);
      alert('❌ Error saving menu as default. Please try again.');
      return false;
    }
  };

  // Function to get current menu statistics
  const getMenuStats = () => {
    return {
      totalItems: menuItems.length,
      categories: Array.from(new Set(menuItems.map(item => item.category))),
      offers: menuItems.filter(item => item.isOffer).length,
      vegItems: menuItems.filter(item => item.isVeg).length
    };
  };

  return {
    menuItems,
    loading,
    addMenuItem,
    updateMenuItem,
    deleteMenuItem,
    resetToDefaults,
    syncWithSharedData,
    saveAsDefault,
    getMenuStats
  };
};