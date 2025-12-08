import { getUserRecipes } from './recipeService';
import { foodItems as defaultFoodItems } from '@/data';

export interface MealItem {
  id: string;
  name: string;
  emoji: string;
  caption: string;
  image: { id: string; hint: string };
  cuisine?: string;
  isCustomRecipe?: boolean;
  recipeId?: string;
}

/**
 * Get all available meals for a user, including default food items and their custom recipes
 * This is used in the "Dinner Without Debate" game
 * Note: Custom recipes are only included for premium users (they can only import if premium)
 */
export async function getUserMeals(userId: string): Promise<MealItem[]> {
  try {
    // Get user's custom recipes from cookbook
    // Note: Only premium users can import recipes, so if they have recipes they're premium
    const customRecipes = await getUserRecipes(userId);
    
    // Convert recipes to meal items
    const recipeMealItems: MealItem[] = customRecipes.map((recipe) => ({
      id: `recipe-${recipe.id}`,
      name: recipe.title,
      emoji: '🍽️',
      caption: 'From your cookbook',
      image: { id: '10', hint: 'recipe' }, // Use pizza image as placeholder for custom recipes
      cuisine: recipe.tags[0] || 'Custom',
      isCustomRecipe: true,
      recipeId: recipe.id,
    }));
    
    // Combine default food items with custom recipes
    return [...defaultFoodItems, ...recipeMealItems];
  } catch (error) {
    console.error('Error fetching user meals:', error);
    // Return default items if there's an error
    return defaultFoodItems;
  }
}

/**
 * Get meals filtered by user preferences
 */
export async function getFilteredMeals(
  userId: string,
  cuisinePreferences?: string[]
): Promise<MealItem[]> {
  const allMeals = await getUserMeals(userId);
  
  if (!cuisinePreferences || cuisinePreferences.length === 0) {
    return allMeals;
  }
  
  // Filter by cuisine preferences, but always include custom recipes
  return allMeals.filter(
    (meal) =>
      meal.isCustomRecipe ||
      (meal.cuisine && cuisinePreferences.includes(meal.cuisine))
  );
}
