import { db } from '@/lib/firebase';
import { Recipe } from '@/types/recipe';
import { collection, addDoc, getDocs, query, where, doc, updateDoc, deleteDoc, serverTimestamp, QueryDocumentSnapshot } from 'firebase/firestore';

const recipesCollection = collection(db, 'recipes');

// Helper to remove undefined values (Firestore doesn't accept undefined)
const removeUndefined = (obj: Record<string, any>): Record<string, any> => {
  return Object.fromEntries(
    Object.entries(obj).filter(([_, value]) => value !== undefined)
  );
};

// Create a new recipe
export const addRecipe = async (userId: string, recipeData: Omit<Recipe, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<string> => {
  // Remove undefined values to avoid Firestore error
  const cleanedData = removeUndefined(recipeData as Record<string, any>);
  
  const newRecipe = {
    ...cleanedData,
    userId,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };
  const docRef = await addDoc(recipesCollection, newRecipe);
  return docRef.id;
};

// Get all recipes for a user
export const getUserRecipes = async (userId: string): Promise<Recipe[]> => {
  const q = query(recipesCollection, where('userId', '==', userId));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc: QueryDocumentSnapshot) => ({ id: doc.id, ...doc.data() } as Recipe));
};

// Update a recipe
export const updateRecipe = async (recipeId: string, updates: Partial<Recipe>): Promise<void> => {
  const recipeDoc = doc(db, 'recipes', recipeId);
  await updateDoc(recipeDoc, {
    ...updates,
    updatedAt: serverTimestamp(),
  });
};

// Delete a recipe
export const deleteRecipe = async (recipeId: string): Promise<void> => {
  const recipeDoc = doc(db, 'recipes', recipeId);
  await deleteDoc(recipeDoc);
};
