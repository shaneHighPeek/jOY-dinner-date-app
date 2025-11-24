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
export const preloadCuisineImages = () => {
  const firstThreeImages = [
    placeholderImages['1'], // Italian - Pasta
    placeholderImages['2'], // Mexican - Tacos
    placeholderImages['3'], // Japanese - Sushi
  ];
  
  firstThreeImages.forEach(url => {
    if (url) {
      Image.prefetch(url);
    }
  });
};

export * from './food-verified';
