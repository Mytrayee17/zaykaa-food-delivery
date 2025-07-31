import React, { useState, useEffect } from 'react';
import { FoodItem } from '@/types/food';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface AdminItemFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (item: Omit<FoodItem, 'id'>) => void;
  initialData?: FoodItem | null;
  title: string;
}

const categories = ['Main Course', 'Starter', 'Rice', 'Bread', 'Dal', 'Dessert', 'Beverage', 'Snacks'];

export const AdminItemForm: React.FC<AdminItemFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  title
}) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    image: '',
    category: '',
    rating: '4.0',
    isVeg: true,
    isOffer: false
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        description: initialData.description,
        price: initialData.price.toString(),
        image: initialData.image,
        category: initialData.category,
        rating: initialData.rating?.toString() || '4.0',
        isVeg: initialData.isVeg,
        isOffer: initialData.isOffer || false
      });
    } else {
      setFormData({
        name: '',
        description: '',
        price: '',
        image: '',
        category: '',
        rating: '4.0',
        isVeg: true,
        isOffer: false
      });
    }
    setErrors({});
  }, [initialData, isOpen]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.price.trim()) newErrors.price = 'Price is required';
    else if (isNaN(Number(formData.price)) || Number(formData.price) <= 0) {
      newErrors.price = 'Price must be a valid positive number';
    }
    if (!formData.image.trim()) newErrors.image = 'Image URL is required';
    if (!formData.category) newErrors.category = 'Category is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const item: Omit<FoodItem, 'id'> = {
      name: formData.name.trim(),
      description: formData.description.trim(),
      price: Number(formData.price),
      image: formData.image.trim(),
      category: formData.category,
      rating: Number(formData.rating),
      isVeg: formData.isVeg,
      isOffer: formData.isOffer
    };

    try {
      onSubmit(item);
      onClose();
    } catch (error) {
      // Handle duplicate item error
      if (error instanceof Error && error.message.includes('already exists')) {
        setErrors({ name: error.message });
      } else {
        // Handle other errors
        setErrors({ general: 'An error occurred while saving the item. Please try again.' });
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* General Error Display */}
          {errors.general && (
            <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md">
              <p className="text-sm text-destructive">{errors.general}</p>
            </div>
          )}

          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter item name"
              className={errors.name ? 'border-destructive' : ''}
            />
            {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Enter item description"
              rows={3}
              className={errors.description ? 'border-destructive' : ''}
            />
            {errors.description && <p className="text-sm text-destructive">{errors.description}</p>}
          </div>

          {/* Price */}
          <div className="space-y-2">
            <Label htmlFor="price">Price (₹) *</Label>
            <Input
              id="price"
              type="number"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              placeholder="Enter price"
              min="1"
              className={errors.price ? 'border-destructive' : ''}
            />
            {errors.price && <p className="text-sm text-destructive">{errors.price}</p>}
          </div>

          {/* Image URL */}
          <div className="space-y-2">
            <Label htmlFor="image">Image URL *</Label>
            <Input
              id="image"
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              placeholder="Enter image URL"
              className={errors.image ? 'border-destructive' : ''}
            />
            {errors.image && <p className="text-sm text-destructive">{errors.image}</p>}
            {formData.image && (
              <div className="mt-2">
                <img 
                  src={formData.image} 
                  alt="Preview" 
                  className="w-20 h-20 object-cover rounded-md"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              </div>
            )}
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="category">Category *</Label>
            <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
              <SelectTrigger className={errors.category ? 'border-destructive' : ''}>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.category && <p className="text-sm text-destructive">{errors.category}</p>}
          </div>

          {/* Rating */}
          <div className="space-y-2">
            <Label htmlFor="rating">Rating (1-5)</Label>
            <Input
              id="rating"
              type="number"
              value={formData.rating}
              onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
              placeholder="Enter rating"
              min="1"
              max="5"
              step="0.1"
            />
          </div>

          {/* Vegetarian Switch */}
          <div className="flex items-center space-x-2">
            <Switch
              id="isVeg"
              checked={formData.isVeg}
              onCheckedChange={(checked) => setFormData({ ...formData, isVeg: checked })}
            />
            <Label htmlFor="isVeg">Vegetarian</Label>
          </div>
          {/* Offer Switch */}
          <div className="flex items-center space-x-2">
            <Switch
              id="isOffer"
              checked={formData.isOffer}
              onCheckedChange={(checked) => setFormData({ ...formData, isOffer: checked })}
            />
            <Label htmlFor="isOffer">Offer</Label>
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1 bg-gradient-primary hover:shadow-hover">
              {initialData ? 'Update Item' : 'Add Item'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};