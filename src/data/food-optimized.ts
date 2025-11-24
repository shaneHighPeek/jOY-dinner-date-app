// Optimized food data with color gradients instead of external images
// This ensures instant loading with no network lag

export interface FoodItem {
  id: string;
  name: string;
  emoji: string;
  caption: string;
  cuisine: string;
  gradient: [string, string]; // Two colors for gradient background
}

export const foodItems: FoodItem[] = [
  // Italian
  { id: 'italian-1', name: 'Pizza', emoji: '🍕', caption: 'The universal language of cheesy goodness.', cuisine: 'Italian', gradient: ['#FF6B6B', '#C92A2A'] },
  { id: 'italian-2', name: 'Pasta', emoji: '🍝', caption: 'A timeless classic, cooked to perfection.', cuisine: 'Italian', gradient: ['#FFD93D', '#F9A825'] },
  { id: 'italian-3', name: 'Risotto', emoji: '🍚', caption: 'Creamy, comforting, and oh-so-Italian.', cuisine: 'Italian', gradient: ['#FFA94D', '#F76707'] },
  { id: 'italian-4', name: 'Lasagna', emoji: '🧀', caption: 'Layers of cheesy, saucy perfection.', cuisine: 'Italian', gradient: ['#FF8787', '#E03131'] },
  { id: 'italian-5', name: 'Gelato', emoji: '🍨', caption: 'Sweet, creamy, and the perfect ending.', cuisine: 'Italian', gradient: ['#A9E34B', '#82C91E'] },

  // Mexican
  { id: 'mexican-1', name: 'Tacos', emoji: '🌮', caption: "Let's taco 'bout a flavor explosion.", cuisine: 'Mexican', gradient: ['#FFD43B', '#FAB005'] },
  { id: 'mexican-2', name: 'Burritos', emoji: '🌯', caption: 'A flavor-packed parcel of joy.', cuisine: 'Mexican', gradient: ['#FF922B', '#FD7E14'] },
  { id: 'mexican-3', name: 'Nachos', emoji: '🧀', caption: 'The ultimate shareable snack.', cuisine: 'Mexican', gradient: ['#FCC419', '#F59F00'] },
  { id: 'mexican-4', name: 'Quesadillas', emoji: '🫓', caption: 'Cheesy, melty, and delicious.', cuisine: 'Mexican', gradient: ['#FFE066', '#FCC419'] },
  { id: 'mexican-5', name: 'Enchiladas', emoji: '🌶️', caption: 'Saucy, cheesy, and full of flavor.', cuisine: 'Mexican', gradient: ['#FF6B6B', '#FA5252'] },

  // Greek
  { id: 'greek-1', name: 'Gyros', emoji: '🥙', caption: 'Wrapped perfection with tzatziki.', cuisine: 'Greek', gradient: ['#74C0FC', '#339AF0'] },
  { id: 'greek-2', name: 'Souvlaki', emoji: '🍢', caption: 'Grilled skewers of Mediterranean magic.', cuisine: 'Greek', gradient: ['#63E6BE', '#20C997'] },
  { id: 'greek-3', name: 'Moussaka', emoji: '🍆', caption: 'Layers of eggplant and savory goodness.', cuisine: 'Greek', gradient: ['#A78BFA', '#7C3AED'] },
  { id: 'greek-4', name: 'Greek Salad', emoji: '🥗', caption: 'Fresh, crisp, and full of flavor.', cuisine: 'Greek', gradient: ['#8CE99A', '#51CF66'] },
  { id: 'greek-5', name: 'Spanakopita', emoji: '🥟', caption: 'Flaky pastry with spinach and feta.', cuisine: 'Greek', gradient: ['#91A7FF', '#5C7CFA'] },

  // Japanese
  { id: 'japanese-1', name: 'Sushi', emoji: '🍣', caption: 'Elegant, fresh, and oh-so-sophisticated.', cuisine: 'Japanese', gradient: ['#FF8787', '#FA5252'] },
  { id: 'japanese-2', name: 'Ramen', emoji: '🍜', caption: 'A hug in a bowl.', cuisine: 'Japanese', gradient: ['#FFD43B', '#FAB005'] },
  { id: 'japanese-3', name: 'Donburi', emoji: '🍱', caption: 'A hearty and delicious rice bowl.', cuisine: 'Japanese', gradient: ['#FFA94D', '#FF922B'] },
  { id: 'japanese-4', name: 'Tempura', emoji: '🍤', caption: 'Light, crispy, and perfectly fried.', cuisine: 'Japanese', gradient: ['#FFE066', '#FCC419'] },
  { id: 'japanese-5', name: 'Teriyaki', emoji: '🍗', caption: 'Sweet, savory, and simply irresistible.', cuisine: 'Japanese', gradient: ['#A0785A', '#8B5A3C'] },

  // Spanish
  { id: 'spanish-1', name: 'Paella', emoji: '🥘', caption: 'A Spanish rice dish bursting with flavor.', cuisine: 'Spanish', gradient: ['#FFD43B', '#F59F00'] },
  { id: 'spanish-2', name: 'Tapas', emoji: '🍢', caption: 'Small plates, big flavors.', cuisine: 'Spanish', gradient: ['#FF8787', '#E03131'] },
  { id: 'spanish-3', name: 'Churros', emoji: '🍩', caption: 'Sweet, crispy, and dipped in chocolate.', cuisine: 'Spanish', gradient: ['#A0785A', '#7D5A3C'] },
  { id: 'spanish-4', name: 'Gazpacho', emoji: '🍅', caption: 'A refreshing cold soup.', cuisine: 'Spanish', gradient: ['#FF6B6B', '#FA5252'] },
  { id: 'spanish-5', name: 'Tortilla Española', emoji: '🥚', caption: 'A classic Spanish omelet.', cuisine: 'Spanish', gradient: ['#FFE066', '#FCC419'] },

  // Indian
  { id: 'indian-1', name: 'Curry', emoji: '🍛', caption: 'Aromatic spices in a rich, creamy sauce.', cuisine: 'Indian', gradient: ['#FF922B', '#FD7E14'] },
  { id: 'indian-2', name: 'Biryani', emoji: '🍚', caption: 'A fragrant and flavorful rice dish.', cuisine: 'Indian', gradient: ['#FFD43B', '#FAB005'] },
  { id: 'indian-3', name: 'Naan', emoji: '🫓', caption: 'The perfect companion for any curry.', cuisine: 'Indian', gradient: ['#FFA94D', '#FF922B'] },
  { id: 'indian-4', name: 'Tandoori', emoji: '🍗', caption: 'Smoky, charred, and full of flavor.', cuisine: 'Indian', gradient: ['#FF6B6B', '#E03131'] },
  { id: 'indian-5', name: 'Samosas', emoji: '🥟', caption: 'Crispy, savory, and irresistible.', cuisine: 'Indian', gradient: ['#FFE066', '#FCC419'] },

  // Chinese
  { id: 'chinese-1', name: 'Dumplings', emoji: '🥟', caption: 'Little pockets of happiness.', cuisine: 'Chinese', gradient: ['#FFE066', '#FCC419'] },
  { id: 'chinese-2', name: 'Stir-fry', emoji: '🥢', caption: 'Quick, fresh, and full of flavor.', cuisine: 'Chinese', gradient: ['#8CE99A', '#51CF66'] },
  { id: 'chinese-3', name: 'Fried Rice', emoji: '🍚', caption: 'A classic comfort food.', cuisine: 'Chinese', gradient: ['#FFD43B', '#FAB005'] },
  { id: 'chinese-4', name: 'Noodles', emoji: '🍜', caption: 'Slurp-worthy and satisfying.', cuisine: 'Chinese', gradient: ['#FFA94D', '#FF922B'] },
  { id: 'chinese-5', name: 'Sweet & Sour', emoji: '🍍', caption: 'The perfect balance of tangy and sweet.', cuisine: 'Chinese', gradient: ['#FF8787', '#FA5252'] },

  // French
  { id: 'french-1', name: 'Croissants', emoji: '🥐', caption: 'Buttery, flaky, and oh-so-French.', cuisine: 'French', gradient: ['#FFE066', '#FCC419'] },
  { id: 'french-2', name: 'Coq au Vin', emoji: '🍗', caption: 'Chicken braised in red wine.', cuisine: 'French', gradient: ['#A0785A', '#7D5A3C'] },
  { id: 'french-3', name: 'Ratatouille', emoji: '🍆', caption: 'A vegetable medley from Provence.', cuisine: 'French', gradient: ['#A78BFA', '#7C3AED'] },
  { id: 'french-4', name: 'Crêpes', emoji: '🥞', caption: 'Thin, delicate, and delicious.', cuisine: 'French', gradient: ['#FFD43B', '#FAB005'] },
  { id: 'french-5', name: 'Baguette', emoji: '🥖', caption: 'Crusty on the outside, soft on the inside.', cuisine: 'French', gradient: ['#FFA94D', '#FF922B'] },

  // Thai
  { id: 'thai-1', name: 'Pad Thai', emoji: '🍜', caption: 'Sweet, sour, salty, and spicy harmony.', cuisine: 'Thai', gradient: ['#FF922B', '#FD7E14'] },
  { id: 'thai-2', name: 'Green Curry', emoji: '🍛', caption: 'Creamy, spicy, and aromatic.', cuisine: 'Thai', gradient: ['#8CE99A', '#51CF66'] },
  { id: 'thai-3', name: 'Tom Yum', emoji: '🍲', caption: 'Hot and sour soup that warms the soul.', cuisine: 'Thai', gradient: ['#FF6B6B', '#FA5252'] },
  { id: 'thai-4', name: 'Spring Rolls', emoji: '🥢', caption: 'Fresh, light, and full of flavor.', cuisine: 'Thai', gradient: ['#A9E34B', '#82C91E'] },
  { id: 'thai-5', name: 'Mango Sticky Rice', emoji: '🥭', caption: 'A sweet and satisfying dessert.', cuisine: 'Thai', gradient: ['#FFD43B', '#FAB005'] },

  // American
  { id: 'american-1', name: 'Burgers', emoji: '🍔', caption: 'Juicy, stacked, and all-American.', cuisine: 'American', gradient: ['#FF6B6B', '#E03131'] },
  { id: 'american-2', name: 'BBQ Ribs', emoji: '🍖', caption: 'Smoky, tender, and finger-licking good.', cuisine: 'American', gradient: ['#A0785A', '#7D5A3C'] },
  { id: 'american-3', name: 'Mac & Cheese', emoji: '🧀', caption: 'Creamy, cheesy comfort food.', cuisine: 'American', gradient: ['#FFD43B', '#FAB005'] },
  { id: 'american-4', name: 'Hot Dogs', emoji: '🌭', caption: 'A classic ballpark favorite.', cuisine: 'American', gradient: ['#FF922B', '#FD7E14'] },
  { id: 'american-5', name: 'Apple Pie', emoji: '🥧', caption: 'As American as it gets.', cuisine: 'American', gradient: ['#FFA94D', '#FF922B'] },
];

// Standardized cuisines for onboarding - these 10 are the core experience
export const cuisines = [
  { id: 'cuisine-1', name: 'Italian', emoji: '🇮🇹', caption: 'Pasta, pizza, and amore!', gradient: ['#FF6B6B', '#C92A2A'] },
  { id: 'cuisine-2', name: 'Mexican', emoji: '🇲🇽', caption: 'Tacos, spice, and everything nice.', gradient: ['#FFD43B', '#FAB005'] },
  { id: 'cuisine-3', name: 'Greek', emoji: '🇬🇷', caption: 'Gyros, salads, and Mediterranean magic.', gradient: ['#74C0FC', '#339AF0'] },
  { id: 'cuisine-4', name: 'Japanese', emoji: '🇯🇵', caption: 'Sushi, ramen, and zen flavors.', gradient: ['#FF8787', '#FA5252'] },
  { id: 'cuisine-5', name: 'Spanish', emoji: '🇪🇸', caption: 'Tapas, paella, and Spanish sunshine.', gradient: ['#FFD43B', '#F59F00'] },
  { id: 'cuisine-6', name: 'Indian', emoji: '🇮🇳', caption: 'Curries, spices, and a feast for the senses.', gradient: ['#FF922B', '#FD7E14'] },
  { id: 'cuisine-7', name: 'Chinese', emoji: '🇨🇳', caption: 'A world of flavor in every bite.', gradient: ['#FFE066', '#FCC419'] },
  { id: 'cuisine-8', name: 'French', emoji: '🇫🇷', caption: 'Elegant, rich, and oh-so-fancy.', gradient: ['#FFE066', '#FCC419'] },
  { id: 'cuisine-9', name: 'Thai', emoji: '🇹🇭', caption: 'Sweet, sour, salty, and spicy harmony.', gradient: ['#8CE99A', '#51CF66'] },
  { id: 'cuisine-10', name: 'American', emoji: '🇺🇸', caption: 'Burgers, fries, and comfort classics.', gradient: ['#FF6B6B', '#E03131'] },
];
