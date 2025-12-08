import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  onboardingComplete: boolean;
  setOnboardingComplete: (status: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [onboardingComplete, setOnboardingCompleteState] = useState(false);
  const [onboardingChecked, setOnboardingChecked] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);

  // Check onboarding status from AsyncStorage
  useEffect(() => {
    const checkOnboardingStatus = async () => {
      try {
        const value = await AsyncStorage.getItem('@onboardingComplete');
        if (value !== null) {
          setOnboardingCompleteState(true);
        }
      } catch (e) {
        console.error('Failed to fetch onboarding status.', e);
      } finally {
        setOnboardingChecked(true);
      }
    };

    checkOnboardingStatus();
  }, []);

  // Listen to Firebase auth state
  useEffect(() => {
    try {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        console.log('Auth state changed:', user ? user.uid : 'no user');
        setUser(user);
        setAuthChecked(true);
      }, (error) => {
        console.error('Auth state error:', error);
        setAuthChecked(true); // Still mark as checked so app doesn't hang
      });

      return unsubscribe;
    } catch (error) {
      console.error('Failed to setup auth listener:', error);
      setAuthChecked(true); // Still mark as checked so app doesn't hang
    }
  }, []);

  // Only set loading to false when BOTH checks are complete
  useEffect(() => {
    if (onboardingChecked && authChecked) {
      setLoading(false);
    }
  }, [onboardingChecked, authChecked]);

  // Safety timeout - if loading takes more than 5 seconds, something is wrong
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (loading) {
        console.warn('useAuth: Loading timeout after 5s, forcing completion');
        setLoading(false);
        setAuthChecked(true);
        setOnboardingChecked(true);
      }
    }, 5000);

    return () => clearTimeout(timeoutId);
  }, [loading]);

  const setOnboardingComplete = async (status: boolean) => {
    try {
      if (status) {
        await AsyncStorage.setItem('@onboardingComplete', 'true');
      } else {
        await AsyncStorage.removeItem('@onboardingComplete');
      }
      setOnboardingCompleteState(status);
    } catch (e) {
      console.error('Failed to save onboarding status.', e);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, onboardingComplete, setOnboardingComplete }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
