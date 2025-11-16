import React, { createContext, useContext, useState, ReactNode } from 'react';

interface OnboardingContextType {
  name: string;
  avatar: string;
  vibe: string;
  cuisinePreferences: string[];
  onboardingComplete: boolean;
  setName: (name: string) => void;
  setAvatar: (avatar: string) => void;
  setVibe: (vibe: string) => void;
  addCuisinePreference: (cuisine: string) => void;
  setOnboardingComplete: (isComplete: boolean) => void;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

export const OnboardingProvider = ({ children }: { children: ReactNode }) => {
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState('😊');
  const [vibe, setVibe] = useState('');
  const [cuisinePreferences, setCuisinePreferences] = useState<string[]>([]);
  const [onboardingComplete, setOnboardingComplete] = useState(false);

  const addCuisinePreference = (cuisine: string) => {
    setCuisinePreferences(prev => [...prev, cuisine]);
  };

  return (
    <OnboardingContext.Provider
      value={{
        name,
        avatar,
        vibe,
        cuisinePreferences,
        onboardingComplete,
        setName,
        setAvatar,
        setVibe,
        addCuisinePreference,
        setOnboardingComplete,
      }}>
      {children}
    </OnboardingContext.Provider>
  );
};

export const useOnboarding = () => {
  const context = useContext(OnboardingContext);
  if (context === undefined) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
};
