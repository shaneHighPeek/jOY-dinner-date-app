import { Text, View, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity, TextInput } from 'react-native';
import { usePremiumStatus } from '@/hooks/usePremiumStatus';
import { Paywall } from '@/components/premium/Paywall';
import { useTheme } from '@/theme/ThemeProvider';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useState, useCallback, useMemo } from 'react';
import { useFocusEffect, router } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';
import { getUserRecipes } from '@/services/recipeService';
import { Recipe } from '@/types/recipe';
import { RecipeCard } from '@/components/cookbook/RecipeCard';
import { Ionicons } from '@expo/vector-icons';

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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  title: {
    fontSize: 32,
    color: colors.text,
    fontWeight: 'bold',
  },
  importButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  searchInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 12,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 44,
    fontSize: 16,
    color: colors.text,
  },
  clearButton: {
    padding: 4,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 8,
  },
  placeholderText: {
    fontSize: 16,
    color: colors.muted,
  },
  noResultsContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 40,
  },
  noResultsText: {
    fontSize: 16,
    color: colors.muted,
    textAlign: 'center',
  },
});

export default function CookbookScreen() {
  const { isPremium } = usePremiumStatus();
  const theme = useTheme();
  const { user } = useAuth();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  if (!theme) return null;
  const { colors } = theme;
  const styles = createStyles(colors);

  // Filter recipes based on search query
  const filteredRecipes = useMemo(() => {
    if (!searchQuery.trim()) return recipes;
    
    const query = searchQuery.toLowerCase().trim();
    return recipes.filter(recipe => {
      // Search by title
      if (recipe.title.toLowerCase().includes(query)) return true;
      
      // Search by tags
      if (recipe.tags?.some(tag => tag.toLowerCase().includes(query))) return true;
      
      // Search by ingredients
      if (recipe.ingredients?.some(group => 
        group.items?.some(item => item.toLowerCase().includes(query))
      )) return true;
      
      return false;
    });
  }, [recipes, searchQuery]);

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

    if (filteredRecipes.length === 0 && searchQuery.trim()) {
      return (
        <View style={styles.noResultsContainer}>
          <Ionicons name="search-outline" size={48} color={colors.muted} />
          <Text style={styles.noResultsText}>No recipes found for "{searchQuery}"</Text>
        </View>
      );
    }

    return (
      <FlatList
        data={filteredRecipes}
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
      <View style={styles.header}>
        <Text style={styles.title}>My Cookbook</Text>
        <TouchableOpacity 
          style={styles.importButton}
          onPress={() => router.push('/cookbook/import')}
        >
          <Ionicons name="add" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
      
      {/* Search Bar - only show if there are recipes */}
      {recipes.length > 0 && (
        <View style={styles.searchContainer}>
          <View style={styles.searchInputWrapper}>
            <Ionicons name="search" size={20} color={colors.muted} style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search recipes, ingredients..."
              placeholderTextColor={colors.muted}
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoCapitalize="none"
              autoCorrect={false}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity style={styles.clearButton} onPress={() => setSearchQuery('')}>
                <Ionicons name="close-circle" size={20} color={colors.muted} />
              </TouchableOpacity>
            )}
          </View>
        </View>
      )}
      
      <View style={styles.contentContainer}>
        {renderContent()}
      </View>
    </Animated.View>
  );
}
