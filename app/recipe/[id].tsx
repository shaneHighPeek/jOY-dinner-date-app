import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, StatusBar, ScrollView, Dimensions } from 'react-native';
import { useLocalSearchParams, Stack, useRouter } from 'expo-router';
import { useTheme } from '@/theme/ThemeProvider';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Mock data for now
const getMockRecipe = (id: string) => ({
  id,
  name: 'Spaghetti Carbonara',
  imageUrl: 'https://www.allrecipes.com/thmb/b2gN3fUvX3422m5GTgs_e-A-A34=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/11973-spaghetti-carbonara-ii-DDMFS-4x3-6ede85b6d340454e932bfe2d31557548.jpg',
  prepTime: '10 mins',
  cookTime: '15 mins',
  servings: '4',
  ingredients: [
    '1 pound spaghetti',
    '2 large eggs',
    '1/2 cup grated Parmesan cheese',
    '4 slices bacon, diced',
    '4 cloves garlic, minced',
    'Salt and black pepper to taste',
  ],
  instructions: [
    'Bring a large pot of lightly salted water to a boil. Cook spaghetti in the boiling water, stirring occasionally until cooked through but firm to the bite, about 12 minutes. Drain and transfer to a large bowl.',
    'While the spaghetti is cooking, place eggs and Parmesan cheese in a small bowl. Whisk well.',
    'Cook bacon in a large skillet over medium-high heat until evenly browned, about 10 minutes. Drain bacon on paper towels, reserving 2 tablespoons of grease in the skillet.',
    'Cook and stir garlic in the reserved bacon grease over medium heat until fragrant, about 1 minute. Add to the bowl with the spaghetti.',
    'Pour egg mixture over the hot spaghetti and toss to coat. The heat from the pasta will cook the eggs. Season with salt and pepper. Serve immediately.',
  ],
});

const HEADER_HEIGHT = 350;
const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function RecipeDetailScreen() {
  const { id } = useLocalSearchParams();
  const { colors, isDarkMode } = useTheme()!;
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const recipe = getMockRecipe(id as string);

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
            <Text style={styles.title}>{recipe.name}</Text>
          </View>
        </View>

        <View style={styles.contentContainer}>
          <View style={styles.detailsRow}>
            <Text style={[styles.detailItem, { color: colors.muted }]}>Prep: {recipe.prepTime}</Text>
            <Text style={[styles.detailItem, { color: colors.muted }]}>Cook: {recipe.cookTime}</Text>
            <Text style={[styles.detailItem, { color: colors.muted }]}>Serves: {recipe.servings}</Text>
          </View>

          <Text style={[styles.sectionTitle, { color: colors.text }]}>Ingredients</Text>
          {recipe.ingredients.map((item, index) => (
            <Text key={index} style={[styles.listItem, { color: colors.text }]}>• {item}</Text>
          ))}

          <Text style={[styles.sectionTitle, { color: colors.text }]}>Instructions</Text>
          {recipe.instructions.map((item, index) => (
            <Text key={index} style={[styles.instructionItem, { color: colors.text }]}>
              <Text style={{ fontWeight: 'bold' }}>Step {index + 1}:</Text> {item}
            </Text>
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
        <TouchableOpacity style={[styles.button, { backgroundColor: colors.primary }]}>
          <Text style={styles.buttonText}>Save to Cookbook</Text>
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
