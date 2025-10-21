import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { ThemeProvider as AppThemeProvider } from '@/src/context/ThemeContext';
import { useColorScheme as useSystemScheme } from 'react-native';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  // Use system scheme BEFORE our app theme provider exists
  const systemScheme = useSystemScheme() ?? 'light';
  return (
    <AppThemeProvider initialScheme={systemScheme as 'light' | 'dark'}>
      <ThemedNavigation />
    </AppThemeProvider>
  );
}

function ThemedNavigation() {
  // Inside provider, use our app scheme
  const scheme = useColorScheme();
  return (
    <ThemeProvider value={scheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
