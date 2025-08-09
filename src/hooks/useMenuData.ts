import { useState, useEffect } from 'react';
import { FoodItem } from '@/types/food';
import { foodItems as defaultFoodItems } from '@/data/foodItems';

// Simple shared storage system that works across all users
const SHARED_MENU_KEY = 'zaykaaSharedMenu';
const LOCAL_BACKUP_KEY = 'zaykaaMenuBackup';
const MENU_DATA_URL = '/menu-data.json';

export const useMenuData = () => {
  const [menuItems, setMenuItems] = useState<FoodItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastSync, setLastSync] = useState<Date | null>(null);

  // Load menu items from shared storage or defaults
  const loadMenuData = () => {
    try {
      // First try to load from shared storage
      const sharedData = localStorage.getItem(SHARED_MENU_KEY);
      if (sharedData) {
        const parsed = JSON.parse(sharedData);
        setMenuItems(parsed.items || defaultFoodItems);
        setLastSync(new Date(parsed.lastUpdated || Date.now()));
        return true;
      }
    } catch (error) {
      console.error('Error loading shared menu:', error);
    }
    
    // Fallback to local backup or defaults
    const backup = localStorage.getItem(LOCAL_BACKUP_KEY);
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

  // Save menu to shared storage
  const saveToSharedStorage = (items: FoodItem[], lastUpdatedOverride?: string) => {
    const menuData = {
      lastUpdated: lastUpdatedOverride ?? new Date().toISOString(),
      items: items,
      totalItems: items.length,
      categories: Array.from(new Set(items.map(item => item.category))),
      offers: items.filter(item => item.isOffer).length,
      vegItems: items.filter(item => item.isVeg).length
    };

    try {
      localStorage.setItem(SHARED_MENU_KEY, JSON.stringify(menuData));
      localStorage.setItem(LOCAL_BACKUP_KEY, JSON.stringify(items));
      setLastSync(new Date());
      return true;
    } catch (error) {
      console.error('Error saving to shared storage:', error);
      return false;
    }
  };

  // Fetch menu from server JSON and update local/shared storage if newer/different
  const syncFromServer = async () => {
    try {
      const response = await fetch(MENU_DATA_URL, { cache: 'no-store' });
      if (!response.ok) return false;
      const serverData = await response.json();

      const serverItems: FoodItem[] | undefined = serverData?.items;
      const serverLastUpdated: string | undefined = serverData?.lastUpdated;
      if (!Array.isArray(serverItems)) return false;

      let shouldUpdate = true;
      try {
        const sharedDataRaw = localStorage.getItem(SHARED_MENU_KEY);
        if (sharedDataRaw) {
          const sharedData = JSON.parse(sharedDataRaw);
          if (sharedData?.lastUpdated && serverLastUpdated) {
            // Update if timestamps differ
            shouldUpdate = sharedData.lastUpdated !== serverLastUpdated;
          } else {
            // Fallback: shallow compare lengths as a cheap signal
            shouldUpdate = (sharedData?.items?.length ?? -1) !== serverItems.length;
          }
        }
      } catch {
        // ignore parse errors and update from server
        shouldUpdate = true;
      }

      if (shouldUpdate) {
        // Clear any old cached data and set server data
        setMenuItems(serverItems);
        saveToSharedStorage(serverItems, serverLastUpdated);
        console.log('Menu synced from server:', serverItems.length, 'items');
      }
      return true;
    } catch (error) {
      console.error('Error syncing from server:', error);
      // Silently ignore network errors; local/shared data remains
      return false;
    }
  };

  useEffect(() => {
    // Try to sync from server first, then fallback to local data
    const initializeData = async () => {
      const serverSyncSuccess = await syncFromServer();
      if (!serverSyncSuccess) {
        // Only load from local storage if server sync failed
        loadMenuData();
      }
      setLoading(false);
    };
    
    initializeData();
  }, []);

  // Auto-sync every 30 seconds
  useEffect(() => {
    const syncInterval = setInterval(() => {
      // Periodically fetch from server to reflect updates to menu-data.json
      syncFromServer();
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
    saveToSharedStorage(updatedItems);
  };

  const updateMenuItem = (id: string, updatedItem: Partial<FoodItem>) => {
    const updatedItems = menuItems.map(item =>
      item.id === id ? { ...item, ...updatedItem } : item
    );
    setMenuItems(updatedItems);
    saveToSharedStorage(updatedItems);
  };

  const deleteMenuItem = (id: string) => {
    // Show confirmation dialog
    const confirmed = window.confirm('Delete this item? This action cannot be undone.');
    if (confirmed) {
      const updatedItems = menuItems.filter(item => item.id !== id);
      setMenuItems(updatedItems);
      saveToSharedStorage(updatedItems);
    }
  };

  const resetToDefaults = () => {
    setMenuItems(defaultFoodItems);
    localStorage.removeItem(SHARED_MENU_KEY);
    localStorage.removeItem(LOCAL_BACKUP_KEY);
  };

  // Function to clear all cached data and force fresh load from server
  const clearCacheAndReload = async () => {
    localStorage.removeItem(SHARED_MENU_KEY);
    localStorage.removeItem(LOCAL_BACKUP_KEY);
    await syncFromServer();
  };

  // Function to sync with shared data
  const syncWithSharedData = () => {
    // Force sync from server and clear any old cached data
    void syncFromServer();
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

  // Function to export current menu for backup
  const exportMenuData = () => {
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
    clearCacheAndReload,
    syncWithSharedData,
    getMenuStats,
    exportMenuData,
    lastSync
  };
};