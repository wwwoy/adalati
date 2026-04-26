import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  I18nManager,
  Linking,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Fonts, Spacing, Radius } from '../theme/colors';
import {
  embassies as EMBASSIES,
  abroadServices as ABROAD_SERVICES,
  importantNumbers as IMPORTANT_NUMBERS,
} from '../data';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';

I18nManager.allowRTL(true);
I18nManager.forceRTL(true);

export default function AbroadScreen() {
  const { colors: Colors } = useTheme();
  const { t } = useLanguage();
  const styles = useMemo(() => makeStyles(Colors), [Colors]);

  const [activeSection, setActiveSection] = useState('services');
  const [expandedEmbassy, setExpandedEmbassy] = useState(null);

  const openService = (service) => {
    const message =
      `${service.desc}\n\n` +
      `• ${t('abroad.serviceSteps')}: ${service.steps}\n` +
      `• ${t('abroad.serviceFee')}: ${service.fee}\n\n` +
      `${t('abroad.servicePrompt')}`;
    Alert.alert(service.label, message, [
      { text: t('common.cancel'), style: 'cancel' },
      {
        text: t('abroad.viewEmbassies'),
        onPress: () => setActiveSection('embassies'),
      },
      {
        text: t('abroad.openPortal'),
        onPress: () => Linking.openURL('https://services.moj.gov.jo'),
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primaryDark} />

      {/* Header */}
      <LinearGradient
        colors={[Colors.primaryDark, Colors.primary, '#2E7D52']}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.headerContent}>
          <View style={styles.headerText}>
            <Text style={styles.headerTitle}>{t('abroad.title')}</Text>
            <Text style={styles.headerSub}>{t('abroad.subtitle')}</Text>
          </View>
          <View style={styles.headerGlobe}>
            <Ionicons name="globe" size={36} color="rgba(255,255,255,0.3)" />
          </View>
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statNum}>٦٣</Text>
            <Text style={styles.statLabel}>سفارة وقنصلية</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNum}>١.٢م</Text>
            <Text style={styles.statLabel}>أردني في الخارج</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNum}>٢٤/٧</Text>
            <Text style={styles.statLabel}>خدمة إلكترونية</Text>
          </View>
        </View>
      </LinearGradient>

      {/* Section Tabs */}
      <View style={styles.sectionTabs}>
        {[
          { key: 'services', label: t('abroad.tabs.services'), icon: 'list-outline' },
          { key: 'embassies', label: t('abroad.tabs.embassies'), icon: 'business-outline' },
          { key: 'numbers', label: t('abroad.tabs.numbers'), icon: 'call-outline' },
        ].map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={[styles.sectionTab, activeSection === tab.key && styles.sectionTabActive]}
            onPress={() => setActiveSection(tab.key)}
          >
            <Ionicons
              name={tab.icon}
              size={16}
              color={activeSection === tab.key ? Colors.primary : Colors.textLight}
            />
            <Text
              style={[
                styles.sectionTabText,
                activeSection === tab.key && styles.sectionTabTextActive,
              ]}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Services */}
        {activeSection === 'services' && (
          <View style={styles.section}>
            {ABROAD_SERVICES.map((service) => (
              <TouchableOpacity
                key={service.id}
                style={styles.serviceRow}
                activeOpacity={0.8}
                onPress={() => openService(service)}
              >
                <View style={styles.serviceLeft}>
                  <Ionicons name="chevron-back" size={18} color={Colors.textMuted} />
                  <View style={styles.stepsWrap}>
                    <Text style={styles.stepsText}>{service.steps} خطوات</Text>
                  </View>
                </View>
                <View style={styles.serviceInfo}>
                  <Text style={styles.serviceName}>{service.label}</Text>
                  <Text style={styles.serviceDesc}>{service.desc}</Text>
                </View>
                <View style={[styles.serviceIcon, { backgroundColor: service.color + '18' }]}>
                  <MaterialCommunityIcons name={service.icon} size={24} color={service.color} />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Embassies */}
        {activeSection === 'embassies' && (
          <View style={styles.section}>
            {EMBASSIES.map((emb) => (
              <TouchableOpacity
                key={emb.id}
                style={[styles.embassyCard, expandedEmbassy === emb.id && styles.embassyExpanded]}
                onPress={() => setExpandedEmbassy(expandedEmbassy === emb.id ? null : emb.id)}
                activeOpacity={0.85}
              >
                <View style={styles.embassyTop}>
                  <Ionicons
                    name={expandedEmbassy === emb.id ? 'chevron-up' : 'chevron-down'}
                    size={18}
                    color={Colors.textLight}
                  />
                  <View style={styles.embassyInfo}>
                    <Text style={styles.embassyCountry}>{emb.country}</Text>
                    <Text style={styles.embassyCity}>
                      <Ionicons name="location-outline" size={12} /> {emb.city}
                    </Text>
                  </View>
                  <Text style={styles.embassyFlag}>{emb.flag}</Text>
                </View>

                {expandedEmbassy === emb.id && (
                  <View style={styles.embassyDetails}>
                    <View style={styles.embassyDetailRow}>
                      <Text style={styles.embassyDetailVal}>{emb.hours}</Text>
                      <View style={styles.embassyDetailIcon}>
                        <Ionicons name="time-outline" size={14} color={Colors.textLight} />
                      </View>
                    </View>
                    <View style={styles.embassyDetailRow}>
                      <TouchableOpacity onPress={() => Linking.openURL(`mailto:${emb.email}`)}>
                        <Text style={[styles.embassyDetailVal, styles.link]}>{emb.email}</Text>
                      </TouchableOpacity>
                      <View style={styles.embassyDetailIcon}>
                        <Ionicons name="mail-outline" size={14} color={Colors.textLight} />
                      </View>
                    </View>
                    <View style={styles.embassyDetailRow}>
                      <TouchableOpacity onPress={() => Linking.openURL(`tel:${emb.phone}`)}>
                        <Text style={[styles.embassyDetailVal, styles.link]}>{emb.phone}</Text>
                      </TouchableOpacity>
                      <View style={styles.embassyDetailIcon}>
                        <Ionicons name="call-outline" size={14} color={Colors.textLight} />
                      </View>
                    </View>
                    <TouchableOpacity style={styles.contactBtn}>
                      <Text style={styles.contactBtnText}>{t('abroad.contact')}</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Important Numbers */}
        {activeSection === 'numbers' && (
          <View style={[styles.section, { paddingBottom: Spacing.xxxl }]}>
            <View style={styles.emergencyBanner}>
              <Text style={styles.emergencyTitle}>{t('abroad.emergencyTitle')}</Text>
              <Text style={styles.emergencyDesc}>
                {t('abroad.emergencyDesc')}
              </Text>
              <TouchableOpacity
                style={styles.emergencyBtn}
                onPress={() => Linking.openURL('tel:110')}
              >
                <Ionicons name="call" size={18} color={Colors.white} />
                <Text style={styles.emergencyBtnText}>{t('abroad.callNow', { number: '١١٠' })}</Text>
              </TouchableOpacity>
            </View>

            {IMPORTANT_NUMBERS.map((num) => (
              <TouchableOpacity
                key={num.id}
                style={styles.numberCard}
                onPress={() => Linking.openURL(`tel:${num.number}`)}
                activeOpacity={0.8}
              >
                <View style={styles.numberLeft}>
                  <View style={styles.callIcon}>
                    <Ionicons name="call" size={16} color={Colors.white} />
                  </View>
                  <Text style={styles.numberText}>{num.number}</Text>
                </View>
                <View style={styles.numberInfo}>
                  <Text style={styles.numberLabel}>{num.label}</Text>
                </View>
                <View style={styles.numberIcon}>
                  <MaterialCommunityIcons name={num.icon} size={22} color={Colors.primary} />
                </View>
              </TouchableOpacity>
            ))}

            {/* Useful Links */}
            <Text style={styles.subTitle}>{t('abroad.usefulLinks')}</Text>
            {[
              { label: t('abroad.linkServices'), url: 'https://services.moj.gov.jo' },
              { label: t('abroad.linkMfa'), url: 'https://www.mfa.gov.jo' },
              { label: t('abroad.linkAbroadGuide'), url: 'https://www.mfa.gov.jo/abroad' },
            ].map((link, i) => (
              <TouchableOpacity
                key={i}
                style={styles.linkRow}
                onPress={() => Linking.openURL(link.url)}
                activeOpacity={0.75}
              >
                <Ionicons name="open-outline" size={16} color={Colors.primary} />
                <Text style={styles.linkText}>{link.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function makeStyles(Colors) {
  return StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scroll: { flex: 1 },
  header: {
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.xl,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerText: { flex: 1 },
  headerTitle: {
    color: Colors.white,
    fontSize: Fonts.xl,
    fontWeight: Fonts.bold,
    textAlign: 'right',
  },
  headerSub: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: Fonts.xs,
    textAlign: 'right',
    marginTop: 4,
  },
  headerGlobe: { marginLeft: Spacing.sm },
  statsRow: {
    flexDirection: 'row',
    marginTop: Spacing.lg,
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: Radius.md,
    paddingVertical: Spacing.md,
  },
  statItem: { flex: 1, alignItems: 'center' },
  statNum: { color: Colors.white, fontSize: Fonts.lg, fontWeight: Fonts.bold },
  statLabel: { color: 'rgba(255,255,255,0.75)', fontSize: 10, marginTop: 2 },
  statDivider: { width: 1, backgroundColor: 'rgba(255,255,255,0.25)' },
  sectionTabs: {
    flexDirection: 'row',
    backgroundColor: Colors.cardBg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  sectionTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.md,
    gap: 6,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  sectionTabActive: {
    borderBottomColor: Colors.primary,
  },
  sectionTabText: {
    fontSize: Fonts.xs,
    color: Colors.textLight,
    fontWeight: Fonts.medium,
  },
  sectionTabTextActive: {
    color: Colors.primary,
    fontWeight: Fonts.bold,
  },
  section: {
    padding: Spacing.base,
    paddingBottom: Spacing.xl,
  },
  // Services
  serviceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.cardBg,
    borderRadius: Radius.md,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: Spacing.md,
  },
  serviceLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  stepsWrap: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    backgroundColor: Colors.accentLight,
    borderRadius: Radius.full,
  },
  stepsText: { fontSize: 9, color: Colors.primary, fontWeight: Fonts.semiBold },
  serviceInfo: { flex: 1, alignItems: 'flex-end' },
  serviceName: {
    fontSize: Fonts.sm,
    fontWeight: Fonts.bold,
    color: Colors.textDark,
    textAlign: 'right',
  },
  serviceDesc: {
    fontSize: Fonts.xs,
    color: Colors.textLight,
    textAlign: 'right',
    marginTop: 2,
  },
  serviceIcon: {
    width: 48,
    height: 48,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  // Embassies
  embassyCard: {
    backgroundColor: Colors.cardBg,
    borderRadius: Radius.md,
    marginBottom: Spacing.sm,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  embassyExpanded: {
    borderColor: Colors.primary + '60',
  },
  embassyTop: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    gap: Spacing.sm,
  },
  embassyFlag: { fontSize: 26 },
  embassyInfo: { flex: 1, alignItems: 'flex-end' },
  embassyCountry: {
    fontSize: Fonts.sm,
    fontWeight: Fonts.bold,
    color: Colors.textDark,
    textAlign: 'right',
  },
  embassyCity: {
    fontSize: Fonts.xs,
    color: Colors.textLight,
    marginTop: 2,
  },
  embassyDetails: {
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.divider,
    gap: Spacing.sm,
  },
  embassyDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: Spacing.sm,
  },
  embassyDetailIcon: {
    width: 28,
    height: 28,
    borderRadius: Radius.full,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  embassyDetailVal: {
    fontSize: Fonts.xs,
    color: Colors.textMedium,
    textAlign: 'right',
  },
  link: { color: Colors.primary },
  contactBtn: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.md,
    paddingVertical: Spacing.sm,
    alignItems: 'center',
    marginTop: Spacing.xs,
  },
  contactBtnText: {
    color: Colors.white,
    fontSize: Fonts.sm,
    fontWeight: Fonts.semiBold,
  },
  // Numbers
  emergencyBanner: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.lg,
    padding: Spacing.base,
    marginBottom: Spacing.base,
  },
  emergencyTitle: {
    color: Colors.white,
    fontSize: Fonts.md,
    fontWeight: Fonts.bold,
    textAlign: 'right',
    marginBottom: Spacing.xs,
  },
  emergencyDesc: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: Fonts.xs,
    textAlign: 'right',
    lineHeight: 18,
    marginBottom: Spacing.md,
  },
  emergencyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.error,
    borderRadius: Radius.full,
    paddingVertical: Spacing.sm,
    gap: Spacing.sm,
  },
  emergencyBtnText: {
    color: Colors.white,
    fontSize: Fonts.base,
    fontWeight: Fonts.bold,
  },
  numberCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.cardBg,
    borderRadius: Radius.md,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: Spacing.md,
  },
  numberLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  callIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: Colors.success,
    alignItems: 'center',
    justifyContent: 'center',
  },
  numberText: {
    fontSize: Fonts.sm,
    fontWeight: Fonts.bold,
    color: Colors.primary,
  },
  numberInfo: { flex: 1, alignItems: 'flex-end' },
  numberLabel: {
    fontSize: Fonts.xs,
    color: Colors.textDark,
    fontWeight: Fonts.medium,
    textAlign: 'right',
  },
  numberIcon: {
    width: 40,
    height: 40,
    borderRadius: Radius.md,
    backgroundColor: Colors.accentLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  subTitle: {
    fontSize: Fonts.base,
    fontWeight: Fonts.bold,
    color: Colors.textDark,
    textAlign: 'right',
    marginTop: Spacing.base,
    marginBottom: Spacing.md,
  },
  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    backgroundColor: Colors.cardBg,
    borderRadius: Radius.md,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    gap: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  linkText: {
    fontSize: Fonts.sm,
    color: Colors.primary,
    fontWeight: Fonts.medium,
  },
});
}
