import { Recipe } from '@/types/recipe';
import { useTheme } from '@/theme/ThemeProvider';
import { router } from 'expo-router';
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');
const CARD_MARGIN = 16;
const CARD_WIDTH = (width - CARD_MARGIN * 3) / 2;

const createStyles = (colors: any) => StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    height: CARD_WIDTH * 1.25, // Aspect ratio 4:5
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: colors.card,
    marginBottom: CARD_MARGIN,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  imageBackground: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '50%',
  },
  title: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    padding: 12,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
});

interface RecipeCardProps {
  recipe: Recipe;
}

export const RecipeCard: React.FC<RecipeCardProps> = ({ recipe }) => {
  const theme = useTheme();
  if (!theme) return null;
  const styles = createStyles(theme.colors);

  // A placeholder image if the recipe doesn't have one
  const placeholderImage = 'https://via.placeholder.com/300';

  return (
    <TouchableOpacity style={styles.card} onPress={() => router.push(`/recipe/${recipe.id}`)}>
      <ImageBackground
        source={{ uri: recipe.imageUrl || placeholderImage }}
        style={styles.imageBackground}
      >
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.8)']}
          style={styles.gradient}
        >
          <Text style={styles.title}>{recipe.title}</Text>
        </LinearGradient>
      </ImageBackground>
    </TouchableOpacity>
  );
};
