import { Text, View, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { usePremiumStatus } from '@/hooks/usePremiumStatus';
import { Paywall } from '@/components/premium/Paywall';
import { useTheme } from '@/theme/ThemeProvider';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useState, useEffect, useCallback } from 'react';
import { useFocusEffect, router } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';
import { getUserRecipes } from '@/services/recipeService';
import { Recipe } from '@/types/recipe';
import { RecipeCard } from '@/components/cookbook/RecipeCard';

type Colors = {
  background: string;
  card: string;
  primary: string;
  accent: string;
  text: string;
  muted: string;
  error: string;
  border: string;
};

const createStyles = (colors: Colors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  title: {
    fontSize: 32,
    color: colors.text,
    fontWeight: 'bold',
    padding: 20,
    paddingTop: 60,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 8,
  },
  placeholderText: {
    fontSize: 16,
    color: colors.muted,
  },
});

export default function CookbookScreen() {
  const { isPremium } = usePremiumStatus();
  const theme = useTheme();
  const { user } = useAuth();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  if (!theme) return null;
  const { colors } = theme;
  const styles = createStyles(colors);

  const fetchRecipes = useCallback(async () => {
    if (!user) return;
    try {
      setLoading(true);
      const userRecipes = await getUserRecipes(user.uid);
      setRecipes(userRecipes);
      setError(null);
    } catch (e) {
      setError('Failed to fetch recipes.');
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useFocusEffect(
    useCallback(() => {
      fetchRecipes();
    }, [fetchRecipes])
  );

  if (!isPremium) {
    return <Paywall />;
  }

  const renderContent = () => {
    if (loading) {
      return <ActivityIndicator size="large" color={colors.primary} />;
    }

    if (error) {
      return <Text style={styles.placeholderText}>{error}</Text>;
    }

    if (recipes.length === 0) {
      return <Text style={styles.placeholderText}>Your saved recipes will appear here.</Text>;
    }

    return (
      <FlatList
        data={recipes}
        keyExtractor={(item) => item.id}
        numColumns={2}
        renderItem={({ item }) => <RecipeCard recipe={item} />}
        contentContainerStyle={{ alignItems: 'center' }}
        showsVerticalScrollIndicator={false}
      />
    );
  };

  return (
    <Animated.View 
      style={styles.container}
      entering={FadeIn.duration(300)}
    >
      <Text style={styles.title}>My Cookbook</Text>
      <View style={styles.contentContainer}>
        {renderContent()}
      </View>
    </Animated.View>
  );
}
