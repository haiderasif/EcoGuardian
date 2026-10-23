// Online demo imagery used while the original Firebase Storage bucket is not
// available. Set EXPO_PUBLIC_USE_DEMO_IMAGES=false to use stored image URLs.
export const USE_DEMO_IMAGES =
  process.env.EXPO_PUBLIC_USE_DEMO_IMAGES === "true";

const FOREST_IMAGES = [
  "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1511497584788-876760111969?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?auto=format&fit=crop&w=1200&q=80",
];

export const DEMO_IMAGES = {
  profile:
    "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=500&q=80",
  currentLocation:
    "https://images.unsplash.com/photo-1699734825395-77d05df67aab?auto=format&fit=crop&w=1400&q=80",
  historicalLocation:
    "https://images.unsplash.com/photo-1518064874225-c8a7ba7a373f?auto=format&fit=crop&w=1400&q=80",
  currentDetection:
    "https://images.unsplash.com/photo-1511497584788-876760111969?auto=format&fit=crop&w=1400&q=80&sat=35",
  historicalDetection:
    "https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&w=1400&q=80&sat=-15",
  currentNdvi:
    "https://images.unsplash.com/photo-1699734825395-77d05df67aab?auto=format&fit=crop&w=1400&q=80&sat=100&hue=35",
  historicalNdvi:
    "https://images.unsplash.com/photo-1518064874225-c8a7ba7a373f?auto=format&fit=crop&w=1400&q=80&sat=100&hue=70",
};

const hash = (value = "") =>
  String(value)
    .split("")
    .reduce((total, character) => total + character.charCodeAt(0), 0);

export const demoListingImage = (originalUrl = "") =>
  USE_DEMO_IMAGES
    ? FOREST_IMAGES[hash(originalUrl) % FOREST_IMAGES.length]
    : originalUrl;

export const demoProfileImage = (originalUrl = "") =>
  USE_DEMO_IMAGES ? DEMO_IMAGES.profile : originalUrl;

export const demoAnalysisImage = (type, originalUrl = "") =>
  USE_DEMO_IMAGES ? DEMO_IMAGES[type] : originalUrl;
