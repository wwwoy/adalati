import 'react-native-gesture-handler';
import React, { useCallback, useEffect } from 'react';
import { I18nManager, Text, TextInput, View, ActivityIndicator, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as SplashScreen from 'expo-splash-screen';
import {
  useFonts,
  Tajawal_300Light,
  Tajawal_400Regular,
  Tajawal_500Medium,
  Tajawal_700Bold,
  Tajawal_800ExtraBold,
} from '@expo-google-fonts/tajawal';
import AppNavigator from './src/navigation/AppNavigator';
import { AuthProvider } from './src/context/AuthContext';
import { LanguageProvider } from './src/context/LanguageContext';
import { ThemeProvider } from './src/context/ThemeContext';
import { FontFamily, familyForWeight } from './src/theme/fonts';

// Force RTL layout. Direction toggle on language change is deferred — the UI
// stays right-anchored even when English is selected (acceptable trade-off).
I18nManager.allowRTL(true);
I18nManager.forceRTL(true);

SplashScreen.preventAutoHideAsync().catch(() => {});

// Apply Tajawal as the default font app-wide. We resolve the proper weighted
// variant (light/regular/medium/bold/extra-bold) from any fontWeight in user
// styles so existing StyleSheet entries keep working unchanged.
function applyDefaultFont() {
  const patch = (Component, label) => {
    if (!Component || Component.__tajawalPatched) return;
    Component.__tajawalPatched = true;
    const originalRender = Component.render;
    if (typeof originalRender === 'function') {
      Component.render = function tajawalRender(...args) {
        const element = originalRender.apply(this, args);
        if (!element || !element.props) return element;
        const flat = StyleSheet.flatten(element.props.style) || {};
        const family = familyForWeight(flat.fontWeight);
        if (typeof flat.fontFamily === 'string' && flat.fontFamily.startsWith('Tajawal')) {
          return element;
        }
        return React.cloneElement(element, {
          style: [element.props.style, { fontFamily: family }],
        });
      };
    } else {
      // React 19 removed defaultProps on functional components, but Text/TextInput
      // are forwardRef objects in RN 0.81 — render IS available. This branch is
      // only a safety net.
      Component.defaultProps = {
        ...(Component.defaultProps || {}),
        style: [{ fontFamily: FontFamily.regular }, Component.defaultProps?.style],
      };
    }
    if (__DEV__) {
      // eslint-disable-next-line no-console
      console.log(`[Tajawal] patched ${label}`);
    }
  };
  patch(Text, 'Text');
  patch(TextInput, 'TextInput');
}
applyDefaultFont();

export default function App() {
  const [fontsLoaded, fontError] = useFonts({
    Tajawal_300Light,
    Tajawal_400Regular,
    Tajawal_500Medium,
    Tajawal_700Bold,
    Tajawal_800ExtraBold,
  });

  const onReady = useCallback(async () => {
    if (fontsLoaded || fontError) {
      await SplashScreen.hideAsync().catch(() => {});
    }
  }, [fontsLoaded, fontError]);

  useEffect(() => {
    onReady();
  }, [onReady]);

  if (!fontsLoaded && !fontError) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#0F1A14' }}>
        <ActivityIndicator color="#C8A850" />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <LanguageProvider>
        <ThemeProvider>
          <AuthProvider>
            <StatusBar style="auto" />
            <AppNavigator />
          </AuthProvider>
        </ThemeProvider>
      </LanguageProvider>
    </SafeAreaProvider>
  );
}
