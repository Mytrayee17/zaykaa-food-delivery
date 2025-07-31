import React, { useState } from 'react';
import { FoodItem } from '@/types/food';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Plus } from 'lucide-react';
import { AdminItemForm } from './AdminItemForm';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface AdminMenuListProps {
  menuItems: FoodItem[];
  onAddItem: (item: Omit<FoodItem, 'id'>) => void;
  onUpdateItem: (id: string, item: Partial<FoodItem>) => void;
  onDeleteItem: (id: string) => void;
  onResetToDefaults: () => void;
}

export const AdminMenuList: React.FC<AdminMenuListProps> = ({
  menuItems,
  onAddItem,
  onUpdateItem,
  onDeleteItem,
  onResetToDefaults
}) => {
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<FoodItem | null>(null);

  const handleEdit = (item: FoodItem) => {
    setEditingItem(item);
  };

  const handleEditSubmit = (updatedItem: Omit<FoodItem, 'id'>) => {
    if (editingItem) {
      onUpdateItem(editingItem.id, updatedItem);
      setEditingItem(null);
    }
  };

  const handleAddSubmit = (newItem: Omit<FoodItem, 'id'>) => {
    onAddItem(newItem);
    setIsAddFormOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <h2 className="text-2xl font-bold text-foreground">Menu Management</h2>
        <div className="flex gap-2">
          <Button
            onClick={() => setIsAddFormOpen(true)}
            className="bg-gradient-primary hover:shadow-hover"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Item
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline">
                Reset to Defaults
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Reset Menu to Defaults</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete all custom menu items and restore the original menu. This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={onResetToDefaults}>
                  Reset Menu
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      {/* Menu Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {menuItems.map((item) => (
          <Card key={item.id} className="shadow-card hover:shadow-hover transition-shadow">
            <CardHeader className="pb-3">
              <div className="aspect-[4/3] rounded-lg overflow-hidden mb-3">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex justify-between items-start gap-2">
                <CardTitle className="text-lg line-clamp-1">{item.name}</CardTitle>
                <Badge variant={item.isVeg ? "secondary" : "destructive"}>
                  {item.isVeg ? "Veg" : "Non-Veg"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                {item.description}
              </p>
              <div className="flex justify-between items-center mb-4">
                <span className="font-bold text-lg text-food-primary">₹{item.price}</span>
                <Badge variant="outline">{item.category}</Badge>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleEdit(item)}
                  className="flex-1"
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button size="sm" variant="outline" className="text-destructive hover:text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Menu Item</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete "{item.name}"? This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction 
                        onClick={() => onDeleteItem(item.id)}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add Item Form Modal */}
      <AdminItemForm
        isOpen={isAddFormOpen}
        onClose={() => setIsAddFormOpen(false)}
        onSubmit={handleAddSubmit}
        title="Add New Menu Item"
      />

      {/* Edit Item Form Modal */}
      <AdminItemForm
        isOpen={!!editingItem}
        onClose={() => setEditingItem(null)}
        onSubmit={handleEditSubmit}
        initialData={editingItem}
        title="Edit Menu Item"
      />
    </div>
  );
};