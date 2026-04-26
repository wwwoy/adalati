import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  I18nManager,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Fonts, Spacing, Radius } from '../theme/colors';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { announcements } from '../data';

I18nManager.allowRTL(true);
I18nManager.forceRTL(true);

export default function AnnouncementDetailScreen({ route, navigation }) {
  const { colors: Colors } = useTheme();
  const { t, lang } = useLanguage();
  const styles = useMemo(() => makeStyles(Colors), [Colors]);

  const id = route?.params?.announcementId;
  const ann = announcements.find((a) => a.id === id);
  const isAr = lang === 'ar';

  if (!ann) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <Ionicons name="chevron-forward" size={24} color={Colors.white} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{t('home.announcements')}</Text>
          <View style={{ width: 24 }} />
        </View>
        <View style={styles.notFound}>
          <Text style={styles.notFoundText}>{t('common.error')}</Text>
        </View>
      </SafeAreaView>
    );
  }

  const title = isAr ? ann.title : (ann.titleEn || ann.title);
  const date = isAr ? ann.date : (ann.dateEn || ann.date);
  const type = isAr ? ann.type : (ann.typeEn || ann.type);
  const body = isAr ? ann.body : (ann.bodyEn || ann.body);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primaryDark} />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <Ionicons name="chevron-forward" size={24} color={Colors.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('home.announcements')}</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: Spacing.xxl }}>
        <LinearGradient
          colors={[Colors.primaryDark, Colors.primary]}
          style={styles.hero}
        >
          <View style={styles.heroMeta}>
            <View style={[styles.badge, ann.urgent && styles.badgeUrgent]}>
              <Text style={[styles.badgeText, ann.urgent && styles.badgeTextUrgent]}>{type}</Text>
            </View>
            <Text style={styles.heroDate}>{date}</Text>
          </View>
          <Text style={styles.heroTitle}>{title}</Text>
        </LinearGradient>

        {!!body && (
          <View style={styles.bodyWrap}>
            <View style={styles.bodyCard}>
              <Text style={styles.bodyText}>{body}</Text>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function makeStyles(Colors) {
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.background },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: Spacing.base,
      paddingVertical: Spacing.md,
      backgroundColor: Colors.primaryDark,
    },
    headerTitle: {
      color: Colors.white,
      fontSize: Fonts.md,
      fontWeight: Fonts.bold,
    },
    hero: {
      paddingHorizontal: Spacing.lg,
      paddingVertical: Spacing.xl,
      borderBottomLeftRadius: Radius.xl,
      borderBottomRightRadius: Radius.xl,
    },
    heroMeta: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: Spacing.md,
    },
    heroDate: {
      color: 'rgba(255,255,255,0.85)',
      fontSize: Fonts.xs,
    },
    badge: {
      paddingHorizontal: Spacing.md,
      paddingVertical: 4,
      borderRadius: Radius.full,
      backgroundColor: 'rgba(255,255,255,0.18)',
    },
    badgeUrgent: { backgroundColor: Colors.gold },
    badgeText: {
      color: Colors.white,
      fontSize: Fonts.xs,
      fontWeight: Fonts.bold,
    },
    badgeTextUrgent: { color: Colors.primaryDark },
    heroTitle: {
      color: Colors.white,
      fontSize: Fonts.xl,
      fontWeight: Fonts.bold,
      textAlign: 'right',
      lineHeight: 32,
    },
    bodyWrap: {
      paddingHorizontal: Spacing.base,
      marginTop: Spacing.lg,
    },
    bodyCard: {
      backgroundColor: Colors.cardBg,
      borderRadius: Radius.lg,
      padding: Spacing.base,
      borderWidth: 1,
      borderColor: Colors.border,
    },
    bodyText: {
      fontSize: Fonts.sm,
      color: Colors.textDark,
      lineHeight: 24,
      textAlign: 'right',
    },
    notFound: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    notFoundText: { color: Colors.textLight },
  });
}
