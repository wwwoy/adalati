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
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Fonts, Spacing, Radius } from '../theme/colors';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { services, serviceCategories } from '../data';

I18nManager.allowRTL(true);
I18nManager.forceRTL(true);

export default function ServiceListScreen({ route, navigation }) {
  const { colors: Colors } = useTheme();
  const { t, lang } = useLanguage();
  const styles = useMemo(() => makeStyles(Colors), [Colors]);

  const categoryId = route?.params?.categoryId;
  const category = categoryId ? serviceCategories.find((c) => c.id === categoryId) : null;
  const isAr = lang === 'ar';

  const list = useMemo(
    () => (categoryId ? services.filter((s) => s.category === categoryId) : services),
    [categoryId]
  );

  const headerTitle = category
    ? isAr ? category.title : (category.titleEn || category.title)
    : t('home.browseServices');

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primaryDark} />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <Ionicons name="chevron-forward" size={24} color={Colors.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>{headerTitle}</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={{ padding: Spacing.base, paddingBottom: Spacing.xxl }}>
        {list.length === 0 ? (
          <View style={styles.empty}>
            <Ionicons name="folder-open-outline" size={42} color={Colors.textMuted} />
            <Text style={styles.emptyText}>{t('service.noServices')}</Text>
          </View>
        ) : (
          list.map((s) => {
            const name = isAr ? s.name : (s.nameEn || s.name);
            const fee = isAr ? s.fee : (s.feeEn || s.fee);
            const desc = isAr ? s.description : (s.descriptionEn || s.description);
            return (
              <TouchableOpacity
                key={s.id}
                style={styles.card}
                activeOpacity={0.85}
                onPress={() => navigation.navigate('ServiceDetail', { serviceId: s.id })}
              >
                <View style={styles.cardHead}>
                  <Ionicons name="chevron-back" size={18} color={Colors.textMuted} />
                  <View style={{ flex: 1, marginRight: Spacing.sm }}>
                    <Text style={styles.cardTitle} numberOfLines={2}>{name}</Text>
                    {!!fee && <Text style={styles.cardFee}>{fee}</Text>}
                  </View>
                  <View style={styles.cardIcon}>
                    <MaterialCommunityIcons name="file-document-outline" size={20} color={Colors.primary} />
                  </View>
                </View>
                {!!desc && <Text style={styles.cardDesc} numberOfLines={2}>{desc}</Text>}
              </TouchableOpacity>
            );
          })
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
      flex: 1,
      textAlign: 'center',
    },
    card: {
      backgroundColor: Colors.cardBg,
      borderRadius: Radius.lg,
      padding: Spacing.base,
      marginBottom: Spacing.sm,
      borderWidth: 1,
      borderColor: Colors.border,
    },
    cardHead: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.sm,
    },
    cardIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: Colors.accentLight,
      alignItems: 'center',
      justifyContent: 'center',
    },
    cardTitle: {
      fontSize: Fonts.base,
      fontWeight: Fonts.bold,
      color: Colors.textDark,
      textAlign: 'right',
    },
    cardFee: {
      fontSize: Fonts.xs,
      color: Colors.primary,
      fontWeight: Fonts.semiBold,
      marginTop: 2,
      textAlign: 'right',
    },
    cardDesc: {
      fontSize: Fonts.xs,
      color: Colors.textLight,
      textAlign: 'right',
      lineHeight: 18,
      marginTop: Spacing.sm,
    },
    empty: {
      alignItems: 'center',
      paddingVertical: Spacing.xxxl,
      gap: Spacing.sm,
    },
    emptyText: {
      color: Colors.textLight,
      fontSize: Fonts.sm,
      textAlign: 'center',
    },
  });
}
