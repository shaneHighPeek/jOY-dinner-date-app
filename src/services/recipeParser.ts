import { Recipe } from '@/types/recipe';

interface RecipeSchema {
  '@type'?: string;
  name?: string;
  image?: string | string[] | { url: string }[];
  recipeIngredient?: string[];
  recipeInstructions?: string[] | Array<{ text: string }> | Array<{ '@type': string; text: string }>;
  prepTime?: string;
  cookTime?: string;
  recipeYield?: string | string[];
  url?: string;
  keywords?: string;
  recipeCategory?: string;
}

/**
 * Parse recipe data from a URL by fetching and extracting JSON-LD structured data
 */
export async function parseRecipeFromUrl(url: string): Promise<Omit<Recipe, 'id' | 'userId' | 'createdAt' | 'updatedAt'>> {
  try {
    // Fetch the HTML content
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to fetch recipe page');
    }
    
    const html = await response.text();
    
    // Extract JSON-LD structured data
    const recipeData = extractRecipeFromHtml(html);
    
    if (!recipeData) {
      throw new Error('No recipe data found on this page. Make sure the URL points to a recipe.');
    }
    
    // Transform to our Recipe format
    return {
      title: recipeData.name || 'Untitled Recipe',
      imageUrl: extractImageUrl(recipeData.image),
      sourceUrl: url,
      prepTime: formatTime(recipeData.prepTime),
      cookTime: formatTime(recipeData.cookTime),
      servings: formatServings(recipeData.recipeYield),
      ingredients: formatIngredients(recipeData.recipeIngredient || []),
      instructions: formatInstructions(recipeData.recipeInstructions || []),
      tags: extractTags(recipeData),
    };
  } catch (error: any) {
    console.error('Recipe parsing error:', error);
    throw new Error(error.message || 'Failed to parse recipe from URL');
  }
}

/**
 * Extract recipe JSON-LD data from HTML
 */
function extractRecipeFromHtml(html: string): RecipeSchema | null {
  try {
    // Look for JSON-LD script tags with Recipe schema
    const jsonLdMatches = html.match(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi);
    
    if (!jsonLdMatches) {
      return null;
    }
    
    for (const match of jsonLdMatches) {
      const jsonContent = match.replace(/<script[^>]*>/i, '').replace(/<\/script>/i, '');
      
      try {
        const data = JSON.parse(jsonContent);
        
        // Handle both single objects and arrays
        const recipes = Array.isArray(data) ? data : [data];
        
        for (const item of recipes) {
          // Check if it's a Recipe type (or has @graph with Recipe)
          if (item['@type'] === 'Recipe') {
            return item;
          }
          
          // Check @graph for Recipe
          if (item['@graph']) {
            const recipe = item['@graph'].find((g: any) => g['@type'] === 'Recipe');
            if (recipe) {
              return recipe;
            }
          }
        }
      } catch (e) {
        // Skip invalid JSON
        continue;
      }
    }
    
    return null;
  } catch (error) {
    console.error('Error extracting recipe from HTML:', error);
    return null;
  }
}

/**
 * Extract image URL from various formats
 */
function extractImageUrl(image: string | string[] | { url: string }[] | undefined): string | undefined {
  if (!image) return undefined;
  
  if (typeof image === 'string') {
    return image;
  }
  
  if (Array.isArray(image)) {
    if (image.length === 0) return undefined;
    
    const firstImage = image[0];
    if (typeof firstImage === 'string') {
      return firstImage;
    }
    if (typeof firstImage === 'object' && firstImage.url) {
      return firstImage.url;
    }
  }
  
  return undefined;
}

/**
 * Format ISO 8601 duration to readable time (e.g., "PT30M" -> "30 min")
 */
function formatTime(duration: string | undefined): string | undefined {
  if (!duration) return undefined;
  
  // Parse ISO 8601 duration format (e.g., PT1H30M)
  const hoursMatch = duration.match(/(\d+)H/);
  const minutesMatch = duration.match(/(\d+)M/);
  
  const hours = hoursMatch ? parseInt(hoursMatch[1]) : 0;
  const minutes = minutesMatch ? parseInt(minutesMatch[1]) : 0;
  
  if (hours === 0 && minutes === 0) return undefined;
  
  const parts = [];
  if (hours > 0) parts.push(`${hours} hr`);
  if (minutes > 0) parts.push(`${minutes} min`);
  
  return parts.join(' ');
}

/**
 * Format servings from various formats
 */
function formatServings(servings: string | string[] | undefined): string | undefined {
  if (!servings) return undefined;
  
  if (Array.isArray(servings)) {
    return servings[0];
  }
  
  return servings;
}

/**
 * Format ingredients into grouped structure
 */
function formatIngredients(ingredients: string[]): Array<{ group: string; items: string[] }> {
  if (!ingredients || ingredients.length === 0) {
    return [{ group: '', items: [] }];
  }
  
  // For now, put all ingredients in a single group
  // In the future, we could detect ingredient groups from the HTML
  return [
    {
      group: '',
      items: ingredients,
    },
  ];
}

/**
 * Format instructions into grouped structure
 */
function formatInstructions(
  instructions: string[] | Array<{ text: string }> | Array<{ '@type': string; text: string }>
): Array<{ group: string; items: string[] }> {
  if (!instructions || instructions.length === 0) {
    return [{ group: '', items: [] }];
  }
  
  const items: string[] = [];
  
  for (const instruction of instructions) {
    if (typeof instruction === 'string') {
      items.push(instruction);
    } else if (instruction.text) {
      items.push(instruction.text);
    }
  }
  
  return [
    {
      group: '',
      items,
    },
  ];
}

/**
 * Extract tags from recipe metadata
 */
function extractTags(recipe: RecipeSchema): string[] {
  const tags: string[] = [];
  
  if (recipe.keywords) {
    // Keywords can be comma-separated
    const keywords = recipe.keywords.split(',').map((k) => k.trim());
    tags.push(...keywords);
  }
  
  if (recipe.recipeCategory) {
    tags.push(recipe.recipeCategory);
  }
  
  return tags.filter((tag) => tag.length > 0);
}
