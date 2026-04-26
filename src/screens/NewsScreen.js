import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  I18nManager,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Fonts, Spacing, Radius } from '../theme/colors';
import { news as NEWS_DATA } from '../data';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';

I18nManager.allowRTL(true);
I18nManager.forceRTL(true);

const CATEGORY_KEYS = ['all', 'announcements', 'laws', 'decisions', 'events', 'tenders'];
const CATEGORY_AR = {
  all: 'الكل',
  announcements: 'إعلانات',
  laws: 'قوانين',
  decisions: 'قرارات',
  events: 'فعاليات',
  tenders: 'مناقصات',
};

const CATEGORY_COLORS = {
  'إعلانات': { bg: '#E8F5E9', tone: 'primary' },
  'قوانين': { bg: '#E3F2FD', tone: '#1565C0' },
  'قرارات': { bg: '#F3E5F5', tone: '#6A1B9A' },
  'فعاليات': { bg: '#FFF8E1', tone: '#F57F17' },
  'مناقصات': { bg: '#FCE4EC', tone: '#AD1457' },
};

export default function NewsScreen() {
  const { colors: Colors } = useTheme();
  const { t } = useLanguage();
  const styles = useMemo(() => makeStyles(Colors), [Colors]);

  const [activeCategoryKey, setActiveCategoryKey] = useState('all');
  const [expandedId, setExpandedId] = useState(null);
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    const activeArabic = CATEGORY_AR[activeCategoryKey];
    let list = activeCategoryKey === 'all' ? NEWS_DATA : NEWS_DATA.filter((n) => n.category === activeArabic);
    const q = search.trim();
    if (q) {
      list = list.filter((n) => n.title.includes(q) || (n.summary || '').includes(q));
    }
    return list;
  }, [activeCategoryKey, search]);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primaryDark} />

      {/* Header */}
      <LinearGradient colors={[Colors.primaryDark, Colors.primary]} style={styles.header}>
        <Text style={styles.headerTitle}>{t('news.title')}</Text>
        <Text style={styles.headerSub}>{t('news.subtitle')}</Text>
      </LinearGradient>

      {/* Category Filter */}
      <View style={styles.filterWrap}>
        <ScrollView
          horizontal
          inverted
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterList}
        >
          {CATEGORY_KEYS.map((catKey) => (
            <TouchableOpacity
              key={catKey}
              style={[styles.catChip, activeCategoryKey === catKey && styles.catChipActive]}
              onPress={() => setActiveCategoryKey(catKey)}
            >
              <Text
                style={[styles.catChipText, activeCategoryKey === catKey && styles.catChipTextActive]}
              >
                {t(`news.categories.${catKey}`)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Search */}
      <View style={styles.searchSection}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={18} color={Colors.textLight} />
          <TextInput
            style={styles.searchInput}
            value={search}
            onChangeText={setSearch}
            placeholder={t('news.searchPlaceholder')}
            placeholderTextColor={Colors.textMuted}
            textAlign="right"
            returnKeyType="search"
          />
          {!!search && (
            <TouchableOpacity onPress={() => setSearch('')} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Ionicons name="close-circle" size={18} color={Colors.textMuted} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* News List */}
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.newsList}>
          {filtered.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="newspaper-outline" size={42} color={Colors.textMuted} />
              <Text style={styles.emptyTitle}>{t('news.noNews')}</Text>
              <Text style={styles.emptySub}>{t('common.tryDifferentFilter')}</Text>
            </View>
          ) : (
            filtered.map((item, index) => {
            const isExpanded = expandedId === item.id;
            const catStyle = CATEGORY_COLORS[item.category] || { bg: '#F0F0F0', tone: '#555' };
            const catTextColor = catStyle.tone === 'primary' ? Colors.primary : catStyle.tone;
            const isFeatured = index === 0 && activeCategoryKey === 'all';

            return (
              <TouchableOpacity
                key={item.id}
                style={[styles.newsCard, isFeatured && styles.featuredCard]}
                onPress={() => setExpandedId(isExpanded ? null : item.id)}
                activeOpacity={0.85}
              >
                {isFeatured && (
                  <LinearGradient
                    colors={['rgba(27,94,59,0.08)', 'rgba(27,94,59,0.02)']}
                    style={StyleSheet.absoluteFillObject}
                    borderRadius={Radius.lg}
                  />
                )}
                <View style={styles.newsTop}>
                  <View style={styles.newsTopLeft}>
                    <Text style={styles.newsDate}>{item.date}</Text>
                    <View style={styles.newsViews}>
                      <Ionicons name="eye-outline" size={12} color={Colors.textMuted} />
                      <Text style={styles.newsViewsText}>{item.views}</Text>
                    </View>
                  </View>
                  <View style={styles.newsTopRight}>
                    {item.urgent && (
                      <View style={styles.urgentBadge}>
                        <Text style={styles.urgentText}>{t('news.urgent')}</Text>
                      </View>
                    )}
                    <View style={[styles.catBadge, { backgroundColor: catStyle.bg }]}>
                      <Text style={[styles.catBadgeText, { color: catTextColor }]}>
                        {item.category}
                      </Text>
                    </View>
                  </View>
                </View>

                <View style={styles.newsBody}>
                  <Text style={styles.newsEmoji}>{item.icon}</Text>
                  <Text style={[styles.newsTitle, isFeatured && styles.newsTitleFeatured]}>
                    {item.title}
                  </Text>
                </View>

                {isExpanded && (
                  <Text style={styles.newsSummary}>{item.summary}</Text>
                )}

                <View style={styles.newsFooter}>
                  <TouchableOpacity style={styles.shareBtn}>
                    <Ionicons name="share-social-outline" size={16} color={Colors.textLight} />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.readMoreBtn}>
                    <Text style={styles.readMoreText}>
                      {isExpanded ? t('news.hide') : t('news.readMore')}
                    </Text>
                    <Ionicons
                      name={isExpanded ? 'chevron-up' : 'chevron-down'}
                      size={14}
                      color={Colors.primary}
                    />
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            );
            })
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function makeStyles(Colors) {
  return StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scroll: { flex: 1 },
  searchSection: {
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.cardBg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.sm,
    gap: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  searchInput: {
    flex: 1,
    fontSize: Fonts.sm,
    color: Colors.textDark,
    paddingVertical: 0,
    textAlign: 'right',
  },
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
  header: {
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.lg,
  },
  headerTitle: {
    color: Colors.white,
    fontSize: Fonts.xl,
    fontWeight: Fonts.bold,
    textAlign: 'right',
  },
  headerSub: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: Fonts.sm,
    textAlign: 'right',
    marginTop: 4,
  },
  filterWrap: {
    backgroundColor: Colors.cardBg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    paddingVertical: Spacing.sm,
  },
  filterList: {
    paddingHorizontal: Spacing.base,
    gap: Spacing.sm,
  },
  catChip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    borderRadius: Radius.full,
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
    marginLeft: Spacing.sm,
  },
  catChipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  catChipText: {
    fontSize: Fonts.xs,
    color: Colors.textMedium,
    fontWeight: Fonts.medium,
  },
  catChipTextActive: {
    color: Colors.white,
    fontWeight: Fonts.bold,
  },
  newsList: {
    padding: Spacing.base,
    paddingBottom: Spacing.xxxl,
    gap: Spacing.md,
  },
  newsCard: {
    backgroundColor: Colors.cardBg,
    borderRadius: Radius.lg,
    padding: Spacing.base,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
  },
  featuredCard: {
    borderColor: Colors.primary + '40',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3,
  },
  newsTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  newsTopLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  newsTopRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  newsDate: {
    fontSize: 10,
    color: Colors.textMuted,
  },
  newsViews: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  newsViewsText: {
    fontSize: 10,
    color: Colors.textMuted,
  },
  urgentBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: Radius.full,
    backgroundColor: Colors.tintPink,
  },
  urgentText: {
    fontSize: 10,
    color: Colors.error,
    fontWeight: Fonts.bold,
  },
  catBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: Radius.full,
  },
  catBadgeText: {
    fontSize: 10,
    fontWeight: Fonts.semiBold,
  },
  newsBody: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  newsEmoji: {
    fontSize: 22,
    lineHeight: 28,
  },
  newsTitle: {
    flex: 1,
    fontSize: Fonts.sm,
    fontWeight: Fonts.semiBold,
    color: Colors.textDark,
    textAlign: 'right',
    lineHeight: 22,
  },
  newsTitleFeatured: {
    fontSize: Fonts.base,
    fontWeight: Fonts.bold,
  },
  newsSummary: {
    fontSize: Fonts.xs,
    color: Colors.textMedium,
    textAlign: 'right',
    lineHeight: 20,
    marginBottom: Spacing.sm,
    paddingTop: Spacing.xs,
    borderTopWidth: 1,
    borderTopColor: Colors.divider,
  },
  newsFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  shareBtn: {
    padding: Spacing.xs,
  },
  readMoreBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  readMoreText: {
    fontSize: Fonts.xs,
    color: Colors.primary,
    fontWeight: Fonts.medium,
  },
});
}
