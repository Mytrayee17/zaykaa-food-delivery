import { useState, useEffect } from 'react';
import { FoodItem } from '@/types/food';
import { foodItems as defaultFoodItems } from '@/data/foodItems';

// Using GitHub as a simple "database" - storing menu data in a public JSON file
const GITHUB_RAW_URL = 'https://raw.githubusercontent.com/Mytrayee17/zaykaa-food-delivery/main/public/menu-data.json';
const FALLBACK_STORAGE_KEY = 'zaykaaMenuBackup';

export const useMenuData = () => {
  const [menuItems, setMenuItems] = useState<FoodItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastSync, setLastSync] = useState<Date | null>(null);

  // Load menu items from GitHub or fallback to defaults
  const loadMenuFromGitHub = async () => {
    try {
      const response = await fetch(GITHUB_RAW_URL + '?t=' + Date.now()); // Cache bust
      if (response.ok) {
        const data = await response.json();
        setMenuItems(data.items || defaultFoodItems);
        setLastSync(new Date());
        return true;
      }
    } catch (error) {
      console.error('Error loading from GitHub:', error);
    }
    
    // Fallback to localStorage backup or defaults
    const backup = localStorage.getItem(FALLBACK_STORAGE_KEY);
    if (backup) {
      try {
        const parsed = JSON.parse(backup);
        setMenuItems(parsed);
        return true;
      } catch (error) {
        console.error('Error loading backup:', error);
      }
    }
    
    setMenuItems(defaultFoodItems);
    return false;
  };

  useEffect(() => {
    loadMenuFromGitHub().finally(() => setLoading(false));
  }, []);

  // Auto-sync every 30 seconds
  useEffect(() => {
    const syncInterval = setInterval(() => {
      loadMenuFromGitHub();
    }, 30000);

    return () => clearInterval(syncInterval);
  }, []);

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
    setMenuItems(updatedItems);
    
    // Save to GitHub (this will be handled by the admin)
    localStorage.setItem(FALLBACK_STORAGE_KEY, JSON.stringify(updatedItems));
  };

  const updateMenuItem = (id: string, updatedItem: Partial<FoodItem>) => {
    const updatedItems = menuItems.map(item =>
      item.id === id ? { ...item, ...updatedItem } : item
    );
    setMenuItems(updatedItems);
    localStorage.setItem(FALLBACK_STORAGE_KEY, JSON.stringify(updatedItems));
  };

  const deleteMenuItem = (id: string) => {
    // Show confirmation dialog
    const confirmed = window.confirm('Delete this item? This action cannot be undone.');
    if (confirmed) {
      const updatedItems = menuItems.filter(item => item.id !== id);
      setMenuItems(updatedItems);
      localStorage.setItem(FALLBACK_STORAGE_KEY, JSON.stringify(updatedItems));
    }
  };

  const resetToDefaults = () => {
    setMenuItems(defaultFoodItems);
    localStorage.removeItem(FALLBACK_STORAGE_KEY);
  };

  // Function to sync with GitHub data
  const syncWithGitHub = async () => {
    setLoading(true);
    await loadMenuFromGitHub();
    setLoading(false);
  };

  // Function to get current menu statistics
  const getMenuStats = () => {
    return {
      totalItems: menuItems.length,
      categories: Array.from(new Set(menuItems.map(item => item.category))),
      offers: menuItems.filter(item => item.isOffer).length,
      vegItems: menuItems.filter(item => item.isVeg).length,
      lastSync: lastSync
    };
  };

  // Function to export current menu for GitHub update
  const exportMenuForGitHub = () => {
    const menuData = {
      lastUpdated: new Date().toISOString(),
      items: menuItems,
      totalItems: menuItems.length,
      categories: Array.from(new Set(menuItems.map(item => item.category))),
      offers: menuItems.filter(item => item.isOffer).length,
      vegItems: menuItems.filter(item => item.isVeg).length
    };

    // Create downloadable JSON file
    const dataStr = JSON.stringify(menuData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = 'menu-data.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    return menuData;
  };

  return {
    menuItems,
    loading,
    addMenuItem,
    updateMenuItem,
    deleteMenuItem,
    resetToDefaults,
    syncWithGitHub,
    getMenuStats,
    exportMenuForGitHub,
    lastSync
  };
};