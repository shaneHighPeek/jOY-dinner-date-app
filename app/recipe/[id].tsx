import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, StatusBar, ScrollView, Dimensions, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, Stack, useRouter } from 'expo-router';
import { useTheme } from '@/theme/ThemeProvider';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Recipe } from '@/types/recipe';

const HEADER_HEIGHT = 350;
const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function RecipeDetailScreen() {
  const { id } = useLocalSearchParams();
  const { colors, isDarkMode } = useTheme()!;
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecipe = async () => {
      if (!id) return;
      
      try {
        const recipeDoc = await getDoc(doc(db, 'recipes', id as string));
        if (recipeDoc.exists()) {
          setRecipe({ id: recipeDoc.id, ...recipeDoc.data() } as Recipe);
        } else {
          setError('Recipe not found');
        }
      } catch (err) {
        console.error('Error fetching recipe:', err);
        setError('Failed to load recipe');
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [id]);

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (error || !recipe) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
        <Text style={{ color: colors.text, fontSize: 18, marginBottom: 20 }}>{error || 'Recipe not found'}</Text>
        <TouchableOpacity onPress={() => router.back()} style={{ padding: 12, backgroundColor: colors.primary, borderRadius: 8 }}>
          <Text style={{ color: 'white', fontWeight: '600' }}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />

      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        bounces={false}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.imageContainer}>
          <Image 
            source={{ uri: recipe.imageUrl }} 
            style={styles.headerImage}
          />
          <View style={[styles.imageForeground, { backgroundColor: 'rgba(0,0,0,0.3)' }]} />
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{recipe.title}</Text>
          </View>
        </View>

        <View style={styles.contentContainer}>
          <View style={styles.detailsRow}>
            {recipe.prepTime && <Text style={[styles.detailItem, { color: colors.muted }]}>Prep: {recipe.prepTime}</Text>}
            {recipe.cookTime && <Text style={[styles.detailItem, { color: colors.muted }]}>Cook: {recipe.cookTime}</Text>}
            {recipe.servings && <Text style={[styles.detailItem, { color: colors.muted }]}>Serves: {recipe.servings}</Text>}
          </View>

          <Text style={[styles.sectionTitle, { color: colors.text }]}>Ingredients</Text>
          {recipe.ingredients.map((group, groupIndex) => (
            <View key={groupIndex}>
              {group.group && <Text style={[styles.groupTitle, { color: colors.text }]}>{group.group}</Text>}
              {group.items.map((item, index) => (
                <Text key={index} style={[styles.listItem, { color: colors.text }]}>• {item}</Text>
              ))}
            </View>
          ))}

          <Text style={[styles.sectionTitle, { color: colors.text }]}>Instructions</Text>
          {recipe.instructions.map((group, groupIndex) => (
            <View key={groupIndex}>
              {group.group && <Text style={[styles.groupTitle, { color: colors.text }]}>{group.group}</Text>}
              {group.items.map((item, index) => (
                <Text key={index} style={[styles.instructionItem, { color: colors.text }]}>
                  <Text style={{ fontWeight: 'bold' }}>Step {index + 1}:</Text> {item}
                </Text>
              ))}
            </View>
          ))}
        </View>
      </ScrollView>

      <TouchableOpacity 
        style={[styles.backButton, { top: insets.top + 10 }]} 
        onPress={() => router.back()}
      >
        <Text style={styles.backButtonText}>←</Text>
      </TouchableOpacity>

      <Animated.View 
        style={[styles.buttonContainer, { 
          borderTopColor: colors.border, 
          paddingBottom: insets.bottom + 10,
          backgroundColor: isDarkMode ? 'rgba(0,0,0,0.8)' : 'rgba(255,255,255,0.8)'
        }]} 
        entering={FadeIn.duration(800).delay(800)}
      >
        <TouchableOpacity 
          style={[styles.button, { backgroundColor: colors.muted }]}
          disabled
        >
          <Text style={styles.buttonText}>Already in Cookbook</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 120, // Space for the button
  },
  imageContainer: {
    width: SCREEN_WIDTH,
    height: HEADER_HEIGHT,
  },
  headerImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  imageForeground: {
    ...StyleSheet.absoluteFillObject,
  },
  titleContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
  },
  title: {
    color: 'white',
    fontSize: 32,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 120, // Space for the button
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  detailItem: {
    fontSize: 14,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  groupTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 12,
    marginBottom: 8,
  },
  listItem: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 4,
  },
  instructionItem: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 12,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderTopWidth: 1,
  },
  button: {
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  backButton: {
    position: 'absolute',
    left: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    color: 'white',
    fontSize: 24,
    lineHeight: 28,
  },
});
