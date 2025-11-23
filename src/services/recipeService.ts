import { db } from '@/lib/firebase';
import { Recipe } from '@/types/recipe';
import { collection, addDoc, getDocs, query, where, doc, updateDoc, deleteDoc, serverTimestamp, QueryDocumentSnapshot } from 'firebase/firestore';

const recipesCollection = collection(db, 'recipes');

// Create a new recipe
export const addRecipe = async (userId: string, recipeData: Omit<Recipe, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<string> => {
  const newRecipe = {
    ...recipeData,
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
