import { placeholderImages1 } from './images-1';
import { placeholderImages2 } from './images-2';
import { placeholderImages3 } from './images-3';
import { placeholderImages4 } from './images-4';
import { Image } from 'react-native';

export const placeholderImages = {
  ...placeholderImages1,
  ...placeholderImages2,
  ...placeholderImages3,
  ...placeholderImages4,
};

// Preload first 3 cuisine images for instant display
export const preloadCuisineImages = async () => {
  const firstThreeImages = [
    placeholderImages['1'],  // Italian - Pasta
    placeholderImages['2'],  // Mexican - Tacos  
    placeholderImages['56'], // Greek - Gyro (3rd in new order)
  ];
  
  try {
    await Promise.all(
      firstThreeImages.map(url => 
        url ? Image.prefetch(url).catch(() => Promise.resolve()) : Promise.resolve()
      )
    );
  } catch (error) {
    console.warn('Error preloading cuisine images:', error);
  }
};

export * from './food-verified';
