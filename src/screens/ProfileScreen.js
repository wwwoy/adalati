import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal,
  Pressable,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Fonts, Spacing, Radius } from '../theme/colors';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const { colors: Colors, mode, setMode, isDark } = useTheme();
  const { t, lang, setLang } = useLanguage();

  const [langModal, setLangModal] = useState(false);
  const [themeModal, setThemeModal] = useState(false);

  const styles = useMemo(() => makeStyles(Colors), [Colors]);

  const initials = (user?.firstName || user?.fullName || '؟').trim().charAt(0);

  const handleLogout = () => {
    Alert.alert(
      t('profile.logoutConfirmTitle'),
      t('profile.logoutConfirmMsg'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        { text: t('profile.logout'), style: 'destructive', onPress: logout },
      ],
    );
  };

  const langValue = lang === 'ar' ? t('profile.languageAr') : t('profile.languageEn');
  const themeValue =
    mode === 'light'
      ? t('profile.themeLight')
      : mode === 'dark'
      ? t('profile.themeDark')
      : t('profile.themeSystem');

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <LinearGradient
          colors={[Colors.primaryDark, Colors.primary, Colors.primaryMid]}
          style={styles.hero}
        >
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials}</Text>
            <View style={styles.verifiedBadge}>
              <Ionicons name="checkmark" size={14} color={Colors.white} />
            </View>
          </View>
          <Text style={styles.fullName}>{user?.fullName}</Text>
          <Text style={styles.username}>@{user?.username}</Text>
        </LinearGradient>

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>0</Text>
            <Text style={styles.statLabel}>{t('profile.stats.appointments')}</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>0</Text>
            <Text style={styles.statLabel}>{t('profile.stats.services')}</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{user?.memberSince || '—'}</Text>
            <Text style={styles.statLabel}>{t('profile.stats.memberSince')}</Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>{t('profile.personalInfo')}</Text>
          <InfoRow icon="card-outline" label={t('profile.nationalId')} value={user?.nationalId} colors={Colors} styles={styles} />
          <InfoRow icon="person-outline" label={t('profile.username')} value={user?.username} colors={Colors} styles={styles} />
          <InfoRow icon="mail-outline" label={t('profile.email')} value={user?.email} colors={Colors} styles={styles} />
          <InfoRow icon="call-outline" label={t('profile.phone')} value={user?.phone} colors={Colors} styles={styles} last colors2={Colors} />
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>{t('profile.settings')}</Text>
          <SettingRow
            icon="notifications-outline"
            label={t('profile.notifications')}
            value={t('profile.notificationsOn')}
            colors={Colors}
            styles={styles}
          />
          <SettingRow
            icon="language-outline"
            label={t('profile.language')}
            value={langValue}
            onPress={() => setLangModal(true)}
            colors={Colors}
            styles={styles}
          />
          <SettingRow
            icon={isDark ? 'moon-outline' : 'sunny-outline'}
            label={t('profile.theme')}
            value={themeValue}
            onPress={() => setThemeModal(true)}
            colors={Colors}
            styles={styles}
          />
          <SettingRow icon="lock-closed-outline" label={t('profile.privacy')} colors={Colors} styles={styles} />
          <SettingRow icon="help-circle-outline" label={t('profile.help')} colors={Colors} styles={styles} />
          <SettingRow icon="information-circle-outline" label={t('profile.about')} value={t('common.version')} colors={Colors} styles={styles} last />
        </View>

        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout} activeOpacity={0.85}>
          <Ionicons name="log-out-outline" size={20} color={Colors.error} />
          <Text style={styles.logoutText}>{t('profile.logout')}</Text>
        </TouchableOpacity>

        <Text style={styles.footer}>{t('profile.footer')}</Text>
      </ScrollView>

      <ChoiceModal
        visible={langModal}
        title={t('profile.selectLanguage')}
        options={[
          { id: 'ar', label: t('profile.languageAr') },
          { id: 'en', label: t('profile.languageEn') },
        ]}
        current={lang}
        onSelect={(id) => {
          setLang(id);
          setLangModal(false);
        }}
        onClose={() => setLangModal(false)}
        colors={Colors}
        styles={styles}
        cancelLabel={t('common.cancel')}
      />

      <ChoiceModal
        visible={themeModal}
        title={t('profile.selectTheme')}
        options={[
          { id: 'light', label: t('profile.themeLight'), icon: 'sunny-outline' },
          { id: 'dark', label: t('profile.themeDark'), icon: 'moon-outline' },
          { id: 'system', label: t('profile.themeSystem'), icon: 'phone-portrait-outline' },
        ]}
        current={mode}
        onSelect={(id) => {
          setMode(id);
          setThemeModal(false);
        }}
        onClose={() => setThemeModal(false)}
        colors={Colors}
        styles={styles}
        cancelLabel={t('common.cancel')}
      />
    </View>
  );
}

function InfoRow({ icon, label, value, colors, styles, last }) {
  return (
    <View style={[styles.infoRow, last && styles.infoRowLast]}>
      <View style={styles.infoIcon}>
        <Ionicons name={icon} size={18} color={colors.primary} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue}>{value || '—'}</Text>
      </View>
    </View>
  );
}

function SettingRow({ icon, label, value, onPress, last, colors, styles }) {
  const Wrapper = onPress ? TouchableOpacity : View;
  return (
    <Wrapper
      style={[styles.settingRow, last && styles.infoRowLast]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.infoIcon}>
        <Ionicons name={icon} size={18} color={colors.primary} />
      </View>
      <Text style={styles.settingLabel}>{label}</Text>
      {value ? <Text style={styles.settingValue}>{value}</Text> : null}
      {onPress ? (
        <Ionicons name="chevron-back" size={18} color={colors.textLight} style={{ marginStart: Spacing.xs }} />
      ) : null}
    </Wrapper>
  );
}

function ChoiceModal({ visible, title, options, current, onSelect, onClose, colors, styles, cancelLabel }) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.modalBackdrop} onPress={onClose}>
        <Pressable style={styles.modalCard} onPress={() => {}}>
          <Text style={styles.modalTitle}>{title}</Text>
          {options.map((opt) => {
            const active = opt.id === current;
            return (
              <TouchableOpacity
                key={opt.id}
                style={[styles.modalOption, active && styles.modalOptionActive]}
                onPress={() => onSelect(opt.id)}
                activeOpacity={0.7}
              >
                {opt.icon ? (
                  <Ionicons name={opt.icon} size={18} color={active ? colors.primary : colors.textMedium} />
                ) : null}
                <Text style={[styles.modalOptionText, active && styles.modalOptionTextActive]}>
                  {opt.label}
                </Text>
                {active ? (
                  <Ionicons name="checkmark-circle" size={20} color={colors.primary} />
                ) : null}
              </TouchableOpacity>
            );
          })}
          <TouchableOpacity style={styles.modalCancel} onPress={onClose} activeOpacity={0.7}>
            <Text style={styles.modalCancelText}>{cancelLabel}</Text>
          </TouchableOpacity>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

function makeStyles(Colors) {
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.background },
    scrollContent: { paddingBottom: Spacing.xxxl },
    hero: {
      paddingTop: Spacing.xxxl + Spacing.md,
      paddingBottom: Spacing.xxl,
      alignItems: 'center',
      borderBottomLeftRadius: Radius.xl,
      borderBottomRightRadius: Radius.xl,
    },
    avatar: {
      width: 96,
      height: 96,
      borderRadius: 48,
      backgroundColor: 'rgba(255,255,255,0.18)',
      borderWidth: 3,
      borderColor: 'rgba(255,255,255,0.4)',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: Spacing.md,
    },
    avatarText: {
      fontSize: 40,
      color: Colors.white,
      fontWeight: Fonts.bold,
    },
    verifiedBadge: {
      position: 'absolute',
      bottom: 0,
      right: 0,
      width: 28,
      height: 28,
      borderRadius: 14,
      backgroundColor: Colors.gold,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 2,
      borderColor: Colors.primary,
    },
    fullName: {
      fontSize: Fonts.lg,
      color: Colors.white,
      fontWeight: Fonts.bold,
      marginBottom: 2,
    },
    username: {
      fontSize: Fonts.sm,
      color: 'rgba(255,255,255,0.8)',
    },
    statsRow: {
      flexDirection: 'row',
      paddingHorizontal: Spacing.base,
      marginTop: -Spacing.lg,
      gap: Spacing.sm,
    },
    statCard: {
      flex: 1,
      backgroundColor: Colors.cardBg,
      borderRadius: Radius.lg,
      padding: Spacing.base,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: Colors.border,
      shadowColor: Colors.shadow,
      shadowOpacity: 1,
      shadowRadius: 8,
      shadowOffset: { width: 0, height: 2 },
      elevation: 2,
    },
    statValue: {
      fontSize: Fonts.lg,
      fontWeight: Fonts.bold,
      color: Colors.primary,
      marginBottom: 2,
    },
    statLabel: {
      fontSize: Fonts.xs,
      color: Colors.textMedium,
    },
    card: {
      marginTop: Spacing.lg,
      marginHorizontal: Spacing.base,
      backgroundColor: Colors.cardBg,
      borderRadius: Radius.lg,
      padding: Spacing.base,
      borderWidth: 1,
      borderColor: Colors.border,
    },
    cardTitle: {
      fontSize: Fonts.md,
      fontWeight: Fonts.bold,
      color: Colors.textDark,
      marginBottom: Spacing.md,
    },
    infoRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: Spacing.sm,
      borderBottomWidth: 1,
      borderBottomColor: Colors.divider,
      gap: Spacing.md,
    },
    infoRowLast: {
      borderBottomWidth: 0,
    },
    infoIcon: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: Colors.accentLight,
      alignItems: 'center',
      justifyContent: 'center',
    },
    infoLabel: {
      fontSize: Fonts.xs,
      color: Colors.textLight,
      marginBottom: 2,
    },
    infoValue: {
      fontSize: Fonts.sm,
      color: Colors.textDark,
      fontWeight: Fonts.medium,
    },
    settingRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: Spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: Colors.divider,
      gap: Spacing.md,
    },
    settingLabel: {
      flex: 1,
      fontSize: Fonts.sm,
      color: Colors.textDark,
      fontWeight: Fonts.medium,
    },
    settingValue: {
      fontSize: Fonts.xs,
      color: Colors.textLight,
    },
    logoutBtn: {
      marginTop: Spacing.lg,
      marginHorizontal: Spacing.base,
      backgroundColor: Colors.cardBg,
      borderRadius: Radius.lg,
      padding: Spacing.base,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: Spacing.sm,
      borderWidth: 1,
      borderColor: Colors.error,
    },
    logoutText: {
      color: Colors.error,
      fontSize: Fonts.md,
      fontWeight: Fonts.bold,
    },
    footer: {
      textAlign: 'center',
      marginTop: Spacing.lg,
      fontSize: Fonts.xs,
      color: Colors.textMuted,
    },
    modalBackdrop: {
      flex: 1,
      backgroundColor: Colors.overlay,
      justifyContent: 'center',
      paddingHorizontal: Spacing.lg,
    },
    modalCard: {
      backgroundColor: Colors.cardBg,
      borderRadius: Radius.lg,
      padding: Spacing.lg,
      borderWidth: 1,
      borderColor: Colors.border,
    },
    modalTitle: {
      fontSize: Fonts.md,
      fontWeight: Fonts.bold,
      color: Colors.textDark,
      marginBottom: Spacing.md,
      textAlign: 'center',
    },
    modalOption: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.md,
      paddingVertical: Spacing.md,
      paddingHorizontal: Spacing.base,
      borderRadius: Radius.md,
      borderWidth: 1,
      borderColor: Colors.border,
      marginBottom: Spacing.sm,
    },
    modalOptionActive: {
      borderColor: Colors.primary,
      backgroundColor: Colors.accentLight,
    },
    modalOptionText: {
      flex: 1,
      fontSize: Fonts.sm,
      color: Colors.textDark,
      fontWeight: Fonts.medium,
    },
    modalOptionTextActive: {
      color: Colors.primary,
      fontWeight: Fonts.bold,
    },
    modalCancel: {
      marginTop: Spacing.sm,
      paddingVertical: Spacing.md,
      alignItems: 'center',
    },
    modalCancelText: {
      color: Colors.textMedium,
      fontSize: Fonts.sm,
      fontWeight: Fonts.medium,
    },
  });
}
