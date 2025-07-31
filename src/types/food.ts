export interface FoodItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  rating?: number;
  isVeg: boolean;
  isOffer: boolean;
}

export interface OrderItem extends FoodItem {
  quantity: number;
}