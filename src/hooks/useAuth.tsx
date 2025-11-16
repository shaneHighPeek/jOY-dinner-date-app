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

  useEffect(() => {
    const checkOnboardingStatus = async () => {
      try {
        const value = await AsyncStorage.getItem('@onboardingComplete');
        if (value !== null) {
          setOnboardingCompleteState(true);
        }
      } catch (e) {
        console.error('Failed to fetch onboarding status.', e);
      }
    };

    checkOnboardingStatus();

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

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
