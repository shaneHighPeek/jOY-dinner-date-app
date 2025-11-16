import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/theme/ThemeProvider';
import { useAuth } from '@/hooks/useAuth';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import Animated, { FadeIn, FadeInDown, FadeInUp } from 'react-native-reanimated';

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
  scrollContent: {
    padding: 24,
    paddingTop: 60,
  },
  progressBar: {
    width: '100%',
    height: 4,
    backgroundColor: colors.primary,
    borderRadius: 2,
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 24,
  },
  ratingCard: {
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    marginBottom: 32,
    borderWidth: 2,
    borderColor: colors.border,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  ratingNumber: {
    fontSize: 48,
    fontWeight: 'bold',
    color: colors.primary,
  },
  stars: {
    fontSize: 28,
  },
  laurelLeft: {
    fontSize: 32,
    marginRight: 8,
  },
  laurelRight: {
    fontSize: 32,
    marginLeft: 8,
  },
  ratingSubtext: {
    fontSize: 16,
    color: colors.accent,
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 16,
  },
  statsCard: {
    backgroundColor: 'transparent',
    alignItems: 'center',
    marginBottom: 24,
  },
  profileImages: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginHorizontal: -10,
    borderWidth: 3,
    borderColor: colors.background,
  },
  statsText: {
    fontSize: 16,
    color: colors.text,
    fontWeight: '600',
    textAlign: 'center',
  },
  testimonialCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  testimonialHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
    borderWidth: 2,
    borderColor: colors.border,
  },
  testimonialName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 2,
  },
  testimonialStars: {
    fontSize: 14,
  },
  testimonialText: {
    fontSize: 14,
    color: colors.muted,
    lineHeight: 20,
    fontStyle: 'italic',
  },
  button: {
    backgroundColor: colors.primary,
    paddingVertical: 18,
    paddingHorizontal: 48,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 40,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
});

const testimonials = [
  {
    name: 'Jake Sullivan',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    text: 'I lost 15 lbs in 2 months! I was about to go on Ozempic but decided to give this app a shot and it worked :)',
    stars: '⭐⭐⭐⭐⭐',
  },
  {
    name: 'Benny Marcs',
    avatar: 'https://randomuser.me/api/portraits/men/45.jpg',
    text: 'The time I have saved by just taking pictures of my food has been invaluable.',
    stars: '⭐⭐⭐⭐⭐',
  },
];

const profilePhotos = [
  'https://randomuser.me/api/portraits/men/22.jpg',
  'https://randomuser.me/api/portraits/women/44.jpg',
  'https://randomuser.me/api/portraits/men/67.jpg',
];

export default function ReviewPromptScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { user } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  
  if (!theme) throw new Error('ReviewPromptScreen must be used within a ThemeProvider');
  const { colors } = theme;
  const styles = createStyles(colors);

  const handleContinue = async () => {
    if (!user || submitting) return;

    setSubmitting(true);

    try {
      // Mark user as having seen the review prompt
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        hasReviewed: true,
      });

      // Navigate back to main app
      router.back();
    } catch (error) {
      console.error('Failed to update review status:', error);
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View 
          style={styles.progressBar}
          entering={FadeIn.duration(800)}
        />

        <Animated.Text 
          style={styles.title}
          entering={FadeInDown.duration(800).delay(200)}
        >
          Give us a rating
        </Animated.Text>

        <Animated.View 
          style={styles.ratingCard}
          entering={FadeInDown.duration(800).delay(400)}
        >
          <View style={styles.ratingRow}>
            <Text style={styles.laurelLeft}>🌿</Text>
            <Text style={styles.ratingNumber}>4.8</Text>
            <Text style={styles.stars}>⭐⭐⭐⭐⭐</Text>
            <Text style={styles.laurelRight}>🌿</Text>
          </View>
          <Text style={styles.ratingSubtext}>200K+ App Ratings</Text>
        </Animated.View>

        <Animated.Text 
          style={styles.sectionTitle}
          entering={FadeInDown.duration(800).delay(600)}
        >
          jOY was made for people like you
        </Animated.Text>

        <Animated.View 
          style={styles.statsCard}
          entering={FadeInDown.duration(800).delay(700)}
        >
          <View style={styles.profileImages}>
            {profilePhotos.map((photo, index) => (
              <Image
                key={index}
                source={{ uri: photo }}
                style={[styles.profileImage, { zIndex: profilePhotos.length - index }]}
              />
            ))}
          </View>
          <Text style={styles.statsText}>5M+ Cal AI Users</Text>
        </Animated.View>

        {testimonials.map((testimonial, index) => (
          <Animated.View
            key={testimonial.name}
            style={styles.testimonialCard}
            entering={FadeInDown.duration(800).delay(800 + index * 100)}
          >
            <View style={styles.testimonialHeader}>
              <Image
                source={{ uri: testimonial.avatar }}
                style={styles.avatar}
              />
              <View style={{ flex: 1 }}>
                <Text style={styles.testimonialName}>{testimonial.name}</Text>
              </View>
              <Text style={styles.testimonialStars}>{testimonial.stars}</Text>
            </View>
            <Text style={styles.testimonialText}>"{testimonial.text}"</Text>
          </Animated.View>
        ))}

        <Animated.View
          entering={FadeInUp.duration(800).delay(1200)}
        >
          <TouchableOpacity 
            style={styles.button}
            onPress={handleContinue}
            disabled={submitting}
          >
            <Text style={styles.buttonText}>
              {submitting ? 'Loading...' : 'Continue'}
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </View>
  );
}
