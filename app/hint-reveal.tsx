import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTheme } from '@/theme/ThemeProvider';
import Animated, { FadeIn, FadeInUp } from 'react-native-reanimated';

type Colors = {
  background: string;
  card: string;
  primary: string;
  accent: string;
  text: string;
  muted: string;
  border: string;
};

const createStyles = (colors: Colors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 24,
    justifyContent: 'center',
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 24,
    padding: 32,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  emoji: {
    fontSize: 80,
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 16,
    textAlign: 'center',
  },
  cuisineText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 16,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: colors.muted,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  likesList: {
    width: '100%',
    marginBottom: 24,
  },
  likeItem: {
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  likeName: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  likeCuisine: {
    fontSize: 14,
    color: colors.muted,
  },
  emptyText: {
    fontSize: 16,
    color: colors.muted,
    textAlign: 'center',
    marginBottom: 24,
  },
  continueButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 40,
    paddingVertical: 16,
    borderRadius: 12,
    width: '100%',
  },
  continueButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
  },
});

const CUISINE_EMOJIS: Record<string, string> = {
  'Italian': '🇮🇹',
  'Mexican': '🇲🇽',
  'Greek': '🇬🇷',
  'Japanese': '🇯🇵',
  'Spanish': '🇪🇸',
  'Indian': '🇮🇳',
  'Chinese': '🇨🇳',
  'French': '🇫🇷',
  'Thai': '🇹🇭',
  'American': '🇺🇸',
  'Korean': '🇰🇷',
  'Vietnamese': '🇻🇳',
  'Middle Eastern': '🧆',
  'Mediterranean': '🫒',
};

export default function HintRevealScreen() {
  const { type, data } = useLocalSearchParams<{
    type: string;
    data: string;
  }>();
  const router = useRouter();
  const theme = useTheme();
  
  if (!theme) throw new Error('HintRevealScreen must be used within a ThemeProvider');
  const { colors } = theme;
  const styles = createStyles(colors);

  const handleContinue = () => {
    router.back();
    router.back(); // Go back twice to close both reveal and menu
  };

  // Top Cuisine Reveal
  if (type === 'top-cuisine') {
    const cuisine = data || '';
    
    // Check if no data
    if (!cuisine || cuisine.includes("hasn't liked") || cuisine.includes("haven't")) {
      return (
        <View style={styles.container}>
          <View style={styles.card}>
            <Text style={styles.emoji}>🤷‍♂️</Text>
            <Text style={styles.title}>No Data Yet</Text>
            <Text style={styles.description}>
              Your partner hasn't liked any items yet. Check back after they've swiped a few cards!
            </Text>
            <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
              <Text style={styles.continueButtonText}>Got It!</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }
    
    const emoji = CUISINE_EMOJIS[cuisine] || '🍽️';

    return (
      <View style={styles.container}>
        <Animated.View style={styles.card} entering={FadeIn.duration(500)}>
          <Animated.Text entering={FadeInUp.duration(500).delay(200)} style={styles.emoji}>
            {emoji}
          </Animated.Text>
          
          <Animated.Text entering={FadeInUp.duration(500).delay(400)} style={styles.title}>
            Your Partner Loves
          </Animated.Text>
          
          <Animated.Text entering={FadeInUp.duration(500).delay(600)} style={styles.cuisineText}>
            {cuisine} Food!
          </Animated.Text>
          
          <Animated.Text entering={FadeInUp.duration(500).delay(800)} style={styles.description}>
            This is their most liked cuisine. Try suggesting {cuisine} restaurants next time! 💡
          </Animated.Text>
          
          <Animated.View entering={FadeInUp.duration(500).delay(1000)} style={{ width: '100%' }}>
            <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
              <Text style={styles.continueButtonText}>Got It!</Text>
            </TouchableOpacity>
          </Animated.View>
        </Animated.View>
      </View>
    );
  }

  // Recent Likes Reveal
  if (type === 'recent-likes') {
    let likes: Array<{ id: string; name: string; cuisine: string }> = [];
    
    try {
      if (data) {
        likes = JSON.parse(data);
      }
    } catch (error) {
      console.error('Failed to parse likes data:', error);
      likes = [];
    }

    return (
      <View style={styles.container}>
        <Animated.View style={styles.card} entering={FadeIn.duration(500)}>
          <Animated.Text entering={FadeInUp.duration(500).delay(200)} style={styles.emoji}>
            ❤️
          </Animated.Text>
          
          <Animated.Text entering={FadeInUp.duration(500).delay(400)} style={styles.title}>
            Partner's Recent Likes
          </Animated.Text>
          
          {likes.length === 0 ? (
            <Animated.Text entering={FadeInUp.duration(500).delay(600)} style={styles.emptyText}>
              Your partner hasn't liked any items yet! 🤷‍♂️
            </Animated.Text>
          ) : (
            <Animated.ScrollView 
              style={styles.likesList}
              entering={FadeInUp.duration(500).delay(600)}
              showsVerticalScrollIndicator={false}
            >
              {likes.map((like, index) => (
                <Animated.View
                  key={like.id}
                  style={styles.likeItem}
                  entering={FadeInUp.duration(300).delay(800 + (index * 100))}
                >
                  <Text style={styles.likeName}>{like.name}</Text>
                  <Text style={styles.likeCuisine}>{like.cuisine}</Text>
                </Animated.View>
              ))}
            </Animated.ScrollView>
          )}
          
          <Animated.View entering={FadeInUp.duration(500).delay(1000)} style={{ width: '100%' }}>
            <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
              <Text style={styles.continueButtonText}>Got It!</Text>
            </TouchableOpacity>
          </Animated.View>
        </Animated.View>
      </View>
    );
  }

  // Fallback
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Unknown Hint Type</Text>
        <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
          <Text style={styles.continueButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
