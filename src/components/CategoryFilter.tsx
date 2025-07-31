import React from 'react';
import { Button } from '@/components/ui/button';

interface CategoryFilterProps {
  categories: string[];
  selectedCategory: string | null;
  onCategorySelect: (category: string | null) => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  selectedCategory,
  onCategorySelect,
}) => {
  return (
    <div className="flex flex-wrap gap-2 mb-6">
      <Button
        variant={selectedCategory === null ? 'default' : 'outline'}
        onClick={() => onCategorySelect(null)}
        className="mb-2"
      >
        All Items
      </Button>
      <Button
        variant={selectedCategory === 'Offers' ? 'default' : 'outline'}
        onClick={() => onCategorySelect('Offers')}
        className="mb-2"
      >
        Offers
      </Button>
      <Button
        variant={selectedCategory === 'Snacks' ? 'default' : 'outline'}
        onClick={() => onCategorySelect('Snacks')}
        className="mb-2"
      >
        Snacks
      </Button>
    </div>
  )
}

export default CategoryFilter;