import React, { useEffect, useMemo, useRef } from 'react';
import { View, Text, StyleSheet, Animated, StatusBar, ActivityIndicator, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Fonts, Spacing } from '../theme/colors';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';

export default function SplashScreen() {
  const { colors: Colors } = useTheme();
  const { t } = useLanguage();
  const styles = useMemo(() => makeStyles(Colors), [Colors]);
  const fade = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.85)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fade, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.spring(scale, { toValue: 1, friction: 6, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primaryDark} />
      <LinearGradient
        colors={[Colors.primaryDark, Colors.primary, Colors.primaryLight]}
        style={StyleSheet.absoluteFillObject}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
      <Animated.View style={[styles.center, { opacity: fade, transform: [{ scale }] }]}>
        <View style={styles.logoCircle}>
          <Image
            source={require('../../assets/adalatilogo.png')}
            style={styles.logoImage}
            resizeMode="contain"
          />
        </View>
        <Text style={styles.title}>{t('splash.title')}</Text>
        <Text style={styles.sub}>{t('splash.subtitle')}</Text>
      </Animated.View>
      <ActivityIndicator color={Colors.white} style={styles.spinner} />
    </View>
  );
}

function makeStyles(Colors) {
  return StyleSheet.create({
    container: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.primaryDark },
    center: { alignItems: 'center' },
    logoCircle: {
      width: 130,
      height: 130,
      borderRadius: 65,
      backgroundColor: 'rgba(255,255,255,0.12)',
      borderWidth: 2,
      borderColor: 'rgba(200,168,80,0.55)',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: Spacing.lg,
      overflow: 'hidden',
    },
    logoImage: { width: 90, height: 90 },
    title: { fontSize: 38, fontWeight: Fonts.bold, color: Colors.white, letterSpacing: 1.2 },
    sub: { fontSize: Fonts.sm, color: 'rgba(255,255,255,0.85)', marginTop: 6 },
    spinner: { position: 'absolute', bottom: 60 },
  });
}
