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
    <div className="mb-6">
      {/* Mobile: Horizontal scrollable */}
      <div className="md:hidden overflow-x-auto pb-2 -mx-4 px-4">
        <div className="flex gap-3 min-w-max">
          <Button
            variant={selectedCategory === null ? 'default' : 'outline'}
            onClick={() => onCategorySelect(null)}
            className="whitespace-nowrap px-4 py-2 text-sm font-medium rounded-full"
          >
            All Items
          </Button>
          <Button
            variant={selectedCategory === 'Offers' ? 'default' : 'outline'}
            onClick={() => onCategorySelect('Offers')}
            className="whitespace-nowrap px-4 py-2 text-sm font-medium rounded-full"
          >
            Offers
          </Button>
          <Button
            variant={selectedCategory === 'Snacks' ? 'default' : 'outline'}
            onClick={() => onCategorySelect('Snacks')}
            className="whitespace-nowrap px-4 py-2 text-sm font-medium rounded-full"
          >
            Snacks
          </Button>
        </div>
      </div>

      {/* Desktop: Wrap layout */}
      <div className="hidden md:flex flex-wrap gap-2">
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
    </div>
  )
}

export default CategoryFilter;