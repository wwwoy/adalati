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
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Fonts, Spacing, Radius } from '../theme/colors';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { services, serviceCategories } from '../data';

I18nManager.allowRTL(true);
I18nManager.forceRTL(true);

export default function ServiceDetailScreen({ route, navigation }) {
  const { colors: Colors } = useTheme();
  const { t, lang, fmt } = useLanguage();
  const styles = useMemo(() => makeStyles(Colors), [Colors]);

  const serviceId = route?.params?.serviceId;
  const service = services.find((s) => s.id === serviceId);
  const category = service ? serviceCategories.find((c) => c.id === service.category) : null;

  const isAr = lang === 'ar';
  const name = service ? (isAr ? service.name : service.nameEn || service.name) : '';
  const description = service ? (isAr ? service.description : service.descriptionEn || service.description) : '';
  const fee = service ? (isAr ? service.fee : service.feeEn || service.fee) : '';
  const docs = service ? (isAr ? service.requiredDocs : service.requiredDocsEn || service.requiredDocs) || [] : [];
  const catTitle = category ? (isAr ? category.title : category.titleEn || category.title) : '';

  if (!service) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <Header title={t('service.details')} onBack={() => navigation.goBack()} Colors={Colors} styles={styles} />
        <View style={styles.notFound}>
          <Ionicons name="alert-circle-outline" size={48} color={Colors.textMuted} />
          <Text style={styles.notFoundText}>{t('common.error')}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primaryDark} />
      <Header title={t('service.details')} onBack={() => navigation.goBack()} Colors={Colors} styles={styles} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: Spacing.xxxl }}>
        <LinearGradient
          colors={[Colors.primaryDark, Colors.primary, Colors.primaryLight]}
          style={styles.hero}
        >
          {!!catTitle && <Text style={styles.heroCategory}>{catTitle}</Text>}
          <Text style={styles.heroTitle}>{name}</Text>
          <View style={styles.heroBadges}>
            {!!fee && (
              <View style={styles.heroBadge}>
                <MaterialCommunityIcons name="cash" size={14} color={Colors.gold} />
                <Text style={styles.heroBadgeText}>{fee}</Text>
              </View>
            )}
            {service.processingDays !== undefined && (
              <View style={styles.heroBadge}>
                <Ionicons name="time-outline" size={14} color={Colors.gold} />
                <Text style={styles.heroBadgeText}>
                  {service.processingDays === 0 ? t('common.free') : `${fmt(service.processingDays)} ${t('service.days')}`}
                </Text>
              </View>
            )}
          </View>
        </LinearGradient>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('service.description')}</Text>
          <View style={styles.card}>
            <Text style={styles.descText}>{description}</Text>
          </View>
        </View>

        {docs.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('service.requiredDocs')}</Text>
            <View style={styles.card}>
              {docs.map((d, i) => (
                <View key={i} style={[styles.docRow, i === docs.length - 1 && { borderBottomWidth: 0 }]}>
                  <Text style={styles.docText}>{d}</Text>
                  <View style={styles.docBullet}>
                    <Ionicons name="checkmark" size={14} color={Colors.primary} />
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}

        <View style={[styles.section, { marginTop: Spacing.lg }]}>
          <TouchableOpacity
            style={styles.ctaPrimary}
            activeOpacity={0.85}
            onPress={() => navigation.navigate('appointments', { serviceId: service.id })}
          >
            <LinearGradient
              colors={[Colors.primary, Colors.primaryLight]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.ctaGradient}
            >
              <Ionicons name="calendar" size={18} color={Colors.white} />
              <Text style={styles.ctaPrimaryText}>{t('service.bookAppointment')}</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function Header({ title, onBack, Colors, styles }) {
  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={onBack} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
        <Ionicons name="chevron-forward" size={24} color={Colors.white} />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>{title}</Text>
      <View style={{ width: 24 }} />
    </View>
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
    heroCategory: {
      color: 'rgba(255,255,255,0.85)',
      fontSize: Fonts.sm,
      textAlign: 'right',
      marginBottom: Spacing.xs,
    },
    heroTitle: {
      color: Colors.white,
      fontSize: Fonts.xxl,
      fontWeight: Fonts.bold,
      textAlign: 'right',
      lineHeight: 36,
      marginBottom: Spacing.md,
    },
    heroBadges: {
      flexDirection: 'row-reverse',
      gap: Spacing.sm,
      flexWrap: 'wrap',
    },
    heroBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      backgroundColor: 'rgba(255,255,255,0.15)',
      paddingHorizontal: Spacing.md,
      paddingVertical: 6,
      borderRadius: Radius.full,
      borderWidth: 1,
      borderColor: 'rgba(255,255,255,0.25)',
    },
    heroBadgeText: {
      color: Colors.white,
      fontSize: Fonts.xs,
      fontWeight: Fonts.semiBold,
    },
    section: {
      paddingHorizontal: Spacing.base,
      marginTop: Spacing.lg,
    },
    sectionTitle: {
      fontSize: Fonts.sm,
      fontWeight: Fonts.bold,
      color: Colors.textMedium,
      textAlign: 'right',
      marginBottom: Spacing.sm,
    },
    card: {
      backgroundColor: Colors.cardBg,
      borderRadius: Radius.lg,
      padding: Spacing.base,
      borderWidth: 1,
      borderColor: Colors.border,
    },
    descText: {
      fontSize: Fonts.sm,
      color: Colors.textDark,
      textAlign: 'right',
      lineHeight: 24,
    },
    docRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: Spacing.sm,
      borderBottomWidth: 1,
      borderBottomColor: Colors.divider,
    },
    docText: {
      flex: 1,
      fontSize: Fonts.sm,
      color: Colors.textDark,
      textAlign: 'right',
      marginRight: Spacing.sm,
    },
    docBullet: {
      width: 24,
      height: 24,
      borderRadius: 12,
      backgroundColor: Colors.accentLight,
      alignItems: 'center',
      justifyContent: 'center',
    },
    ctaPrimary: {
      borderRadius: Radius.lg,
      overflow: 'hidden',
    },
    ctaGradient: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: Spacing.md,
      gap: Spacing.sm,
    },
    ctaPrimaryText: {
      color: Colors.white,
      fontSize: Fonts.base,
      fontWeight: Fonts.bold,
    },
    notFound: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      gap: Spacing.sm,
    },
    notFoundText: {
      color: Colors.textLight,
      fontSize: Fonts.sm,
    },
  });
}
