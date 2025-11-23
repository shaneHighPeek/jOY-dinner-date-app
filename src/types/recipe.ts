export interface Recipe {
  id: string;
  userId: string;
  title: string;
  imageUrl?: string;
  sourceUrl?: string;
  prepTime?: string; // e.g., "20 minutes"
  cookTime?: string; // e.g., "45 minutes"
  servings?: string; // e.g., "4-6 people"
  ingredients: {
    group: string; // e.g., "For the dough" or "Main"
    items: string[];
  }[];
  instructions: {
    group: string; // e.g., "For the dough" or "Main"
    items: string[];
  }[];
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}
