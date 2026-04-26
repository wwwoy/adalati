// Centralized font family names (registered via expo-font in App.js).
// Use these constants in styles instead of system defaults.
export const FontFamily = {
  light: 'Tajawal_300Light',
  regular: 'Tajawal_400Regular',
  medium: 'Tajawal_500Medium',
  bold: 'Tajawal_700Bold',
  extraBold: 'Tajawal_800ExtraBold',
};

// Map a numeric/semantic weight to a Tajawal family.
export function familyForWeight(weight) {
  switch (String(weight)) {
    case '300':
    case 'light':
      return FontFamily.light;
    case '500':
    case 'medium':
      return FontFamily.medium;
    case '600':
    case '700':
    case 'bold':
      return FontFamily.bold;
    case '800':
    case '900':
    case 'extrabold':
      return FontFamily.extraBold;
    default:
      return FontFamily.regular;
  }
}
