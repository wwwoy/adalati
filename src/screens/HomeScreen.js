import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  I18nManager,
  TextInput,
  Pressable,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Fonts, Spacing, Radius } from '../theme/colors';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import {
  quickServices as QUICK_SERVICES,
  serviceCategories as SERVICE_CATEGORIES,
  announcements as ANNOUNCEMENTS,
} from '../data';

I18nManager.allowRTL(true);
I18nManager.forceRTL(true);

export default function HomeScreen({ navigation }) {
  const { user } = useAuth();
  const { colors: Colors, mode, setMode, isDark } = useTheme();
  const { t, lang, setLang } = useLanguage();
  const styles = useMemo(() => makeStyles(Colors, isDark), [Colors, isDark]);
  const [search, setSearch] = useState('');
  const isAr = lang === 'ar';

  const localizedServices = useMemo(
    () =>
      QUICK_SERVICES.map((s) => ({
        ...s,
        _label: isAr ? s.label : s.labelEn || s.label,
        _fee: isAr ? s.fee : s.feeEn || s.fee,
      })),
    [isAr]
  );

  const localizedCategories = useMemo(
    () =>
      SERVICE_CATEGORIES.map((c) => ({
        ...c,
        _title: isAr ? c.title : c.titleEn || c.title,
        _description: isAr ? c.description : c.descriptionEn || c.description,
      })),
    [isAr]
  );

  const localizedAnnouncements = useMemo(
    () =>
      ANNOUNCEMENTS.slice(0, 3).map((a) => ({
        ...a,
        _title: isAr ? a.title : a.titleEn || a.title,
        _date: isAr ? a.date : a.dateEn || a.date,
        _type: isAr ? a.type : a.typeEn || a.type,
      })),
    [isAr]
  );

  const filteredServices = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return localizedServices;
    return localizedServices.filter((s) => s._label.toLowerCase().includes(q));
  }, [search, localizedServices]);

  const filteredCategories = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return localizedCategories;
    return localizedCategories.filter(
      (c) =>
        c._title.toLowerCase().includes(q) ||
        (c._description || '').toLowerCase().includes(q)
    );
  }, [search, localizedCategories]);

  const noResults =
    search.trim() && filteredServices.length === 0 && filteredCategories.length === 0;

  const tabsRoot = navigation.getParent?.();
  const goTab = (tabId, params) => {
    if (tabsRoot) tabsRoot.navigate(tabId, params);
  };

  const handleQuickService = (service) => {
    if (service.category === 'appointment') goTab('appointments');
    else if (service.category === 'abroad') goTab('abroad');
    else if (service.serviceRef)
      navigation.navigate('ServiceDetail', { serviceId: service.serviceRef });
  };

  const toggleLang = () => setLang(isAr ? 'en' : 'ar');
  const cycleTheme = () => {
    const next = mode === 'light' ? 'dark' : mode === 'dark' ? 'system' : 'light';
    setMode(next);
  };

  const themeIcon =
    mode === 'light' ? 'sunny-outline' : mode === 'dark' ? 'moon-outline' : 'phone-portrait-outline';
  const themeLabel =
    mode === 'light'
      ? t('profile.themeLight')
      : mode === 'dark'
      ? t('profile.themeDark')
      : t('profile.themeSystem');
  const initial = (user?.firstName || user?.fullName || '?').trim().charAt(0);
  const greetingName = user?.firstName || '';

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={Colors.background}
      />

      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.avatarBtn}
            onPress={() => goTab('profile')}
            activeOpacity={0.8}
          >
            <Text style={styles.avatarText}>{initial}</Text>
          </TouchableOpacity>

          <View style={styles.brand}>
            <Image
              source={require('../../assets/adalatilogo.png')}
              style={styles.brandLogo}
              resizeMode="contain"
            />
            <Text style={styles.brandText}>{t('common.appName')}</Text>
          </View>

          <View style={styles.headerActions}>
            <Pressable
              style={({ pressed }) => [styles.chip, pressed && styles.chipPressed]}
              onPress={toggleLang}
              hitSlop={6}
            >
              <Ionicons name="language-outline" size={14} color={Colors.primary} />
              <Text style={styles.chipText}>{isAr ? 'EN' : 'AR'}</Text>
            </Pressable>

            <Pressable
              style={({ pressed }) => [styles.chip, pressed && styles.chipPressed]}
              onPress={cycleTheme}
              hitSlop={6}
            >
              <Ionicons name={themeIcon} size={14} color={Colors.primary} />
              <Text style={styles.chipText}>{themeLabel}</Text>
            </Pressable>

            <TouchableOpacity style={styles.iconBtn} activeOpacity={0.7}>
              <Ionicons name="notifications-outline" size={20} color={Colors.textMedium} />
              <View style={styles.dot} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Greeting */}
        <View style={styles.greetingBlock}>
          <Text style={styles.greetingHi}>
            {user
              ? isAr
                ? `أهلاً ${greetingName} 👋`
                : `Hi, ${greetingName} 👋`
              : t('home.guestGreeting')}
          </Text>
          <Text style={styles.greetingTagline}>{t('home.tagline')}</Text>
        </View>

        {/* Search */}
        <View style={styles.searchSection}>
          <View style={styles.searchBar}>
            <Ionicons name="search" size={18} color={Colors.textLight} />
            <TextInput
              style={styles.searchInput}
              value={search}
              onChangeText={setSearch}
              placeholder={t('home.searchPlaceholder')}
              placeholderTextColor={Colors.textMuted}
              textAlign={isAr ? 'right' : 'left'}
              returnKeyType="search"
            />
            {!!search && (
              <TouchableOpacity
                onPress={() => setSearch('')}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Ionicons name="close-circle" size={18} color={Colors.textMuted} />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {noResults && (
          <View style={styles.emptyState}>
            <Ionicons name="search-outline" size={42} color={Colors.textMuted} />
            <Text style={styles.emptyTitle}>{t('common.noResults')}</Text>
            <Text style={styles.emptySub}>{t('common.tryDifferentSearch')}</Text>
          </View>
        )}

        {/* Hero Assistant CTA */}
        <View style={styles.section}>
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => goTab('chat')}
            style={styles.assistantWrap}
          >
            <LinearGradient
              colors={[Colors.primaryDark, Colors.primary, Colors.primaryLight]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.assistantCard}
            >
              <View style={styles.assistantBadge}>
                <Image
                  source={require('../../assets/adalatilogo.png')}
                  style={styles.assistantBadgeLogo}
                  resizeMode="contain"
                />
                <Text style={styles.assistantBadgeText}>{t('common.appName')}</Text>
              </View>
              <View style={styles.assistantBody}>
                <View style={styles.assistantText}>
                  <Text style={styles.assistantTitle}>{t('home.askAssistant')}</Text>
                  <Text style={styles.assistantDesc}>{t('home.askAssistantDesc')}</Text>
                </View>
                <View style={styles.assistantIcon}>
                  <MaterialCommunityIcons
                    name="chat-processing"
                    size={28}
                    color={Colors.gold}
                  />
                </View>
              </View>
              <View style={styles.assistantCta}>
                <Text style={styles.assistantCtaText}>
                  {isAr ? 'ابدأ المحادثة' : 'Start chat'}
                </Text>
                <Ionicons
                  name={isAr ? 'arrow-back' : 'arrow-forward'}
                  size={16}
                  color={Colors.white}
                />
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Quick Services */}
        {filteredServices.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <TouchableOpacity onPress={() => navigation.navigate('ServiceList')}>
                <Text style={styles.seeAll}>{t('common.seeAll')}</Text>
              </TouchableOpacity>
              <Text style={styles.sectionTitle}>{t('home.quickServices')}</Text>
            </View>

            <View style={styles.servicesGrid}>
              {filteredServices.map((service) => (
                <TouchableOpacity
                  key={service.id}
                  style={styles.serviceCard}
                  activeOpacity={0.75}
                  onPress={() => handleQuickService(service)}
                >
                  <View
                    style={[
                      styles.serviceIconBox,
                      { backgroundColor: (service.color || Colors.primary) + (isDark ? '30' : '18') },
                    ]}
                  >
                    <Text style={styles.serviceIcon}>{service.icon}</Text>
                  </View>
                  <Text style={styles.serviceLabel} numberOfLines={1}>
                    {service._label}
                  </Text>
                  {!!service._fee && (
                    <Text style={styles.serviceFee} numberOfLines={1}>
                      {service._fee}
                    </Text>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Categories */}
        {filteredCategories.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <TouchableOpacity onPress={() => navigation.navigate('ServiceList')}>
                <Text style={styles.seeAll}>{t('common.seeAll')}</Text>
              </TouchableOpacity>
              <Text style={styles.sectionTitle}>{t('home.browseServices')}</Text>
            </View>

            {filteredCategories.map((cat) => (
              <TouchableOpacity
                key={cat.id}
                style={styles.categoryRow}
                activeOpacity={0.8}
                onPress={() =>
                  navigation.navigate('ServiceList', { categoryId: cat.id })
                }
              >
                <View style={styles.categoryRight}>
                  <View
                    style={[
                      styles.categoryIconBox,
                      { backgroundColor: cat.color + (isDark ? '30' : '18') },
                    ]}
                  >
                    <MaterialCommunityIcons
                      name={cat.icon}
                      size={22}
                      color={cat.color}
                    />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.categoryTitle}>{cat._title}</Text>
                    <Text style={styles.categoryCount}>
                      {t('home.serviceCount', { count: cat.count })}
                    </Text>
                  </View>
                </View>
                <Ionicons
                  name={isAr ? 'chevron-back' : 'chevron-forward'}
                  size={18}
                  color={Colors.textMuted}
                />
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Announcements */}
        <View style={[styles.section, { paddingBottom: Spacing.xl }]}>
          <View style={styles.sectionHeader}>
            <TouchableOpacity onPress={() => goTab('news')}>
              <Text style={styles.seeAll}>{t('common.more')}</Text>
            </TouchableOpacity>
            <Text style={styles.sectionTitle}>{t('home.announcements')}</Text>
          </View>

          {localizedAnnouncements.map((ann) => (
            <TouchableOpacity
              key={ann.id}
              style={styles.announcementCard}
              activeOpacity={0.8}
              onPress={() =>
                navigation.navigate('AnnouncementDetail', {
                  announcementId: ann.id,
                })
              }
            >
              <View style={styles.annHeader}>
                <View
                  style={[styles.annBadge, ann.urgent && styles.annBadgeUrgent]}
                >
                  <Text
                    style={[
                      styles.annBadgeText,
                      ann.urgent && styles.annBadgeTextUrgent,
                    ]}
                  >
                    {ann._type}
                  </Text>
                </View>
                <Text style={styles.annDate}>{ann._date}</Text>
              </View>
              <Text style={styles.annTitle} numberOfLines={2}>
                {ann._title}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function makeStyles(Colors, isDark) {
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.background },
    scroll: { flex: 1 },
    scrollContent: { paddingBottom: Spacing.xxl },

    // Header
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: Spacing.base,
      paddingTop: Spacing.sm,
      paddingBottom: Spacing.sm,
    },
    avatarBtn: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: Colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 2,
      borderColor: Colors.gold,
    },
    avatarText: {
      color: Colors.white,
      fontSize: Fonts.base,
      fontWeight: Fonts.bold,
    },
    brand: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
    },
    brandLogo: { width: 26, height: 26 },
    brandText: {
      fontSize: Fonts.base,
      fontWeight: Fonts.bold,
      color: Colors.primary,
      letterSpacing: 0.3,
    },
    headerActions: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.xs,
    },
    chip: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      paddingHorizontal: Spacing.sm + 2,
      paddingVertical: 6,
      borderRadius: Radius.full,
      backgroundColor: Colors.cardBg,
      borderWidth: 1,
      borderColor: Colors.border,
    },
    chipPressed: {
      backgroundColor: Colors.accentLight,
      borderColor: Colors.primary,
    },
    chipText: {
      fontSize: Fonts.xs,
      color: Colors.primary,
      fontWeight: Fonts.semiBold,
    },
    iconBtn: {
      width: 36,
      height: 36,
      borderRadius: Radius.full,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: Colors.cardBg,
      borderWidth: 1,
      borderColor: Colors.border,
      marginLeft: 2,
    },
    dot: {
      position: 'absolute',
      top: 8,
      right: 9,
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: Colors.error,
      borderWidth: 1.5,
      borderColor: Colors.cardBg,
    },

    // Greeting
    greetingBlock: {
      paddingHorizontal: Spacing.base,
      paddingTop: Spacing.sm,
      paddingBottom: Spacing.md,
    },
    greetingHi: {
      fontSize: Fonts.xxl,
      fontWeight: Fonts.bold,
      color: Colors.textDark,
      textAlign: 'right',
      marginBottom: 4,
    },
    greetingTagline: {
      fontSize: Fonts.sm,
      color: Colors.textMedium,
      textAlign: 'right',
      lineHeight: 20,
    },

    // Search
    searchSection: {
      paddingHorizontal: Spacing.base,
      marginBottom: Spacing.xs,
    },
    searchBar: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: Colors.cardBg,
      borderRadius: Radius.full,
      paddingHorizontal: Spacing.base,
      paddingVertical: Spacing.sm + 2,
      gap: Spacing.sm,
      borderWidth: 1,
      borderColor: Colors.border,
    },
    searchInput: {
      flex: 1,
      fontSize: Fonts.sm,
      color: Colors.textDark,
      paddingVertical: 0,
    },

    // Empty
    emptyState: {
      alignItems: 'center',
      paddingHorizontal: Spacing.lg,
      paddingVertical: Spacing.xxl,
      gap: Spacing.sm,
    },
    emptyTitle: {
      fontSize: Fonts.base,
      fontWeight: Fonts.bold,
      color: Colors.textDark,
      marginTop: Spacing.sm,
    },
    emptySub: {
      fontSize: Fonts.xs,
      color: Colors.textLight,
      textAlign: 'center',
      lineHeight: 18,
    },

    // Sections
    section: {
      paddingHorizontal: Spacing.base,
      marginTop: Spacing.lg,
    },
    sectionHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: Spacing.md,
    },
    sectionTitle: {
      fontSize: Fonts.md,
      fontWeight: Fonts.bold,
      color: Colors.textDark,
      textAlign: 'right',
    },
    seeAll: {
      fontSize: Fonts.sm,
      color: Colors.primary,
      fontWeight: Fonts.medium,
    },

    // Assistant hero
    assistantWrap: {
      borderRadius: Radius.xl,
      overflow: 'hidden',
      shadowColor: Colors.primary,
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: isDark ? 0.4 : 0.25,
      shadowRadius: 14,
      elevation: 6,
    },
    assistantCard: {
      padding: Spacing.lg,
      borderRadius: Radius.xl,
    },
    assistantBadge: {
      alignSelf: 'flex-start',
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      paddingHorizontal: Spacing.sm,
      paddingVertical: 4,
      borderRadius: Radius.full,
      backgroundColor: 'rgba(255,255,255,0.18)',
      borderWidth: 1,
      borderColor: 'rgba(255,255,255,0.25)',
      marginBottom: Spacing.md,
    },
    assistantBadgeLogo: { width: 16, height: 16 },
    assistantBadgeText: {
      fontSize: 10,
      color: Colors.white,
      fontWeight: Fonts.bold,
      letterSpacing: 0.5,
    },
    assistantBody: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    assistantText: { flex: 1, alignItems: 'flex-end' },
    assistantTitle: {
      fontSize: Fonts.lg,
      fontWeight: Fonts.bold,
      color: Colors.white,
      textAlign: 'right',
      marginBottom: 4,
    },
    assistantDesc: {
      fontSize: Fonts.xs,
      color: 'rgba(255,255,255,0.85)',
      textAlign: 'right',
      lineHeight: 18,
    },
    assistantIcon: {
      width: 56,
      height: 56,
      borderRadius: Radius.lg,
      backgroundColor: 'rgba(255,255,255,0.15)',
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1.5,
      borderColor: 'rgba(255,255,255,0.25)',
      marginLeft: Spacing.md,
    },
    assistantCta: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      marginTop: Spacing.md,
      paddingTop: Spacing.md,
      borderTopWidth: 1,
      borderTopColor: 'rgba(255,255,255,0.18)',
      justifyContent: 'flex-end',
    },
    assistantCtaText: {
      fontSize: Fonts.sm,
      color: Colors.white,
      fontWeight: Fonts.semiBold,
    },

    // Quick services
    servicesGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: Spacing.sm,
      justifyContent: 'flex-start',
    },
    serviceCard: {
      width: '31%',
      backgroundColor: Colors.cardBg,
      borderRadius: Radius.lg,
      paddingVertical: Spacing.md,
      paddingHorizontal: Spacing.sm,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: Colors.border,
    },
    serviceIconBox: {
      width: 48,
      height: 48,
      borderRadius: Radius.md,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: Spacing.sm,
    },
    serviceIcon: { fontSize: 24 },
    serviceLabel: {
      fontSize: Fonts.xs,
      fontWeight: Fonts.semiBold,
      color: Colors.textDark,
      textAlign: 'center',
    },
    serviceFee: {
      fontSize: 10,
      color: Colors.primary,
      fontWeight: Fonts.semiBold,
      marginTop: 2,
    },

    // Categories
    categoryRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: Colors.cardBg,
      borderRadius: Radius.lg,
      padding: Spacing.base,
      marginBottom: Spacing.sm,
      borderWidth: 1,
      borderColor: Colors.border,
    },
    categoryRight: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.md,
      flex: 1,
      justifyContent: 'flex-end',
    },
    categoryIconBox: {
      width: 44,
      height: 44,
      borderRadius: Radius.md,
      alignItems: 'center',
      justifyContent: 'center',
      marginLeft: Spacing.md,
    },
    categoryTitle: {
      fontSize: Fonts.base,
      fontWeight: Fonts.semiBold,
      color: Colors.textDark,
      textAlign: 'right',
    },
    categoryCount: {
      fontSize: Fonts.xs,
      color: Colors.textLight,
      textAlign: 'right',
      marginTop: 2,
    },

    // Announcements
    announcementCard: {
      backgroundColor: Colors.cardBg,
      borderRadius: Radius.lg,
      padding: Spacing.base,
      marginBottom: Spacing.sm,
      borderWidth: 1,
      borderColor: Colors.border,
    },
    annHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: Spacing.sm,
    },
    annDate: {
      fontSize: Fonts.xs,
      color: Colors.textMuted,
    },
    annBadge: {
      paddingHorizontal: Spacing.sm,
      paddingVertical: 3,
      borderRadius: Radius.full,
      backgroundColor: Colors.accentLight,
    },
    annBadgeUrgent: { backgroundColor: Colors.tintOrange },
    annBadgeText: {
      fontSize: Fonts.xs,
      color: Colors.primary,
      fontWeight: Fonts.semiBold,
    },
    annBadgeTextUrgent: { color: Colors.warning },
    annTitle: {
      fontSize: Fonts.sm,
      color: Colors.textDark,
      textAlign: 'right',
      lineHeight: 22,
      fontWeight: Fonts.medium,
    },
  });
}
