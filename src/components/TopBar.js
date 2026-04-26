import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  I18nManager,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Fonts, Spacing, Radius } from '../theme/colors';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';

I18nManager.allowRTL(true);
I18nManager.forceRTL(true);

const TopBar = () => {
  const navigation = useNavigation();
  const { user } = useAuth();
  const { colors: Colors } = useTheme();
  const { lang } = useLanguage();
  const styles = useMemo(() => makeStyles(Colors), [Colors]);
  const initial = user?.firstName?.[0] || 'م';

  const goToProfile = () => {
    try {
      const parent = navigation.getParent?.();
      (parent || navigation).navigate('profile');
    } catch (e) {
      // tab may be unavailable in some screens
    }
  };

  return (
    <View style={styles.topBar}>
      <View style={styles.topBarLeft}>
        <TouchableOpacity style={styles.topBadge}>
          <Text style={styles.topBadgeText}>JO</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.topBadge}>
          <Text style={styles.topBadgeText}>JD</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.topBadgeRow}>
          <Ionicons name="globe-outline" size={14} color={Colors.textMedium} />
          <Text style={styles.topBadgeText}> {lang === 'ar' ? 'العربية' : 'English'}</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.topBarRight}>
        <TouchableOpacity style={styles.iconBtn}>
          <Ionicons name="notifications-outline" size={20} color={Colors.textMedium} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconBtn}>
          <Ionicons name="contrast-outline" size={20} color={Colors.textMedium} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconBtn}>
          <Text style={styles.fontSizeText}>+A</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconBtn}>
          <Text style={styles.fontSizeText}>−A</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.avatarBtn} onPress={goToProfile} activeOpacity={0.8}>
          <Text style={styles.avatarText}>{initial}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export { TopBar };

function makeStyles(Colors) {
  return StyleSheet.create({
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.white,
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  topBarLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  topBarRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  topBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    borderRadius: Radius.full,
    backgroundColor: Colors.accentLight,
    marginHorizontal: 2,
  },
  topBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    borderRadius: Radius.full,
    backgroundColor: Colors.accentLight,
  },
  topBadgeText: {
    fontSize: Fonts.xs,
    color: Colors.primary,
    fontWeight: Fonts.semiBold,
  },
  iconBtn: {
    padding: 6,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fontSizeText: {
    fontSize: Fonts.xs,
    color: Colors.textMedium,
    fontWeight: Fonts.bold,
  },
  avatarBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: Spacing.xs,
    borderWidth: 1.5,
    borderColor: Colors.gold,
  },
  avatarText: {
    color: Colors.white,
    fontSize: Fonts.sm,
    fontWeight: Fonts.bold,
  },
});
}
