import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/theme/ThemeProvider';
import { useAuth } from '@/hooks/useAuth';
import { Ionicons } from '@expo/vector-icons';
import { parseRecipeFromUrl } from '@/services/recipeParser';
import { addRecipe } from '@/services/recipeService';
import { usePremiumStatus } from '@/hooks/usePremiumStatus';
import { Paywall } from '@/components/premium/Paywall';
import { Linking } from 'react-native';

const EXAMPLE_URLS: { [key: string]: string } = {
  'AllRecipes': 'https://www.allrecipes.com/recipes/',
  'Food Network': 'https://www.foodnetwork.com/recipes',
  'Bon Appétit': 'https://www.bonappetit.com/recipes',
  'NYT Cooking': 'https://cooking.nytimes.com/',
  'Serious Eats': 'https://www.seriouseats.com/recipes',
  'Tasty': 'https://tasty.co/'
};

export default function ImportRecipeScreen() {
  const router = useRouter();
  const theme = useTheme()!;
  const { user } = useAuth();
  const { isPremium } = usePremiumStatus();
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSitePress = async (site: string) => {
    const url = EXAMPLE_URLS[site];
    if (url) {
      await Linking.openURL(url);
    }
  };

  const handleImport = async () => {
    if (!url.trim()) {
      setError('Please enter a URL');
      return;
    }

    if (!user) {
      setError('You must be logged in to import recipes');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Parse the recipe from the URL
      const recipeData = await parseRecipeFromUrl(url);
      
      // Save to Firestore
      await addRecipe(user.uid, recipeData);
      
      Alert.alert(
        'Success!',
        'Recipe imported successfully',
        [
          {
            text: 'OK',
            onPress: () => router.back(),
          },
        ]
      );
    } catch (err: any) {
      console.error('Import error:', err);
      setError(err.message || 'Failed to import recipe. Please check the URL and try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isPremium) {
    return <Paywall />;
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Import Recipe</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        {/* Instructions */}
        <View style={styles.instructionsCard}>
          <Ionicons name="information-circle" size={24} color={theme.colors.primary} />
          <Text style={[styles.instructionsTitle, { color: theme.colors.text }]}>
            How to Import
          </Text>
          <Text style={[styles.instructionsText, { color: theme.colors.muted }]}>
            Paste a link to any recipe from popular cooking websites. We'll automatically extract the recipe details for you.
          </Text>
        </View>

        {/* URL Input */}
        <View style={styles.inputContainer}>
          <Text style={[styles.label, { color: theme.colors.text }]}>Recipe URL</Text>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: theme.colors.card,
                color: theme.colors.text,
                borderColor: error ? '#ef4444' : theme.colors.border,
              },
            ]}
            placeholder="https://example.com/recipe"
            placeholderTextColor={theme.colors.muted}
            value={url}
            onChangeText={(text) => {
              setUrl(text);
              setError(null);
            }}
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="url"
            editable={!loading}
          />
          {error && (
            <View style={styles.errorContainer}>
              <Ionicons name="alert-circle" size={16} color="#ef4444" />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}
        </View>

        {/* Supported Sites */}
        <View style={styles.supportedSites}>
          <Text style={[styles.supportedTitle, { color: theme.colors.muted }]}>
            Works best with:
          </Text>
          <View style={styles.sitesList}>
            {Object.keys(EXAMPLE_URLS).map((site) => (
              <TouchableOpacity 
                key={site} 
                style={[styles.siteTag, { backgroundColor: theme.colors.card, borderColor: theme.colors.primary, borderWidth: 1 }]}
                onPress={() => handleSitePress(site)}
              >
                <Text style={[styles.siteText, { color: theme.colors.primary }]}>{site}</Text>
                <Ionicons name="open-outline" size={12} color={theme.colors.primary} style={{ marginLeft: 4 }} />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Import Button */}
        <TouchableOpacity
          style={[
            styles.importButton,
            { backgroundColor: theme.colors.primary },
            loading && styles.importButtonDisabled,
          ]}
          onPress={handleImport}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Ionicons name="download" size={20} color="#fff" />
              <Text style={styles.importButtonText}>Import Recipe</Text>
            </>
          )}
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
  },
  instructionsCard: {
    padding: 20,
    borderRadius: 12,
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    marginBottom: 24,
    alignItems: 'center',
  },
  instructionsTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 12,
    marginBottom: 8,
  },
  instructionsText: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  inputContainer: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    height: 50,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    borderWidth: 1,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 6,
  },
  errorText: {
    color: '#ef4444',
    fontSize: 14,
  },
  supportedSites: {
    marginBottom: 32,
  },
  supportedTitle: {
    fontSize: 14,
    marginBottom: 12,
  },
  sitesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  siteTag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
  },
  siteText: {
    fontSize: 12,
    fontWeight: '600',
  },
  importButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 56,
    borderRadius: 12,
    gap: 8,
  },
  importButtonDisabled: {
    opacity: 0.6,
  },
  importButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
