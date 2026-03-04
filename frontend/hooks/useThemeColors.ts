import { useColorScheme } from 'react-native';
import { Colors, ThemeColors } from '@/constants/Colors';

export function useThemeColors(): ThemeColors {
  const colorScheme = useColorScheme();
  return Colors[colorScheme === 'dark' ? 'dark' : 'light'];
}
