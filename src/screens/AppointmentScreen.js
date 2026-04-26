import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  I18nManager,
  Modal,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Fonts, Spacing, Radius } from '../theme/colors';
import { courts as COURTS, appointmentTypes as SERVICE_TYPES, governorates as GOVERNORATES } from '../data';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';

I18nManager.allowRTL(true);
I18nManager.forceRTL(true);

const MY_APPOINTMENTS = [
  {
    id: 1,
    court: 'محكمة بداية عمان',
    type: 'توثيق وكالة',
    date: '٢٨ نيسان ٢٠٢٦',
    time: '٠٩:٣٠ ص',
    number: 'A-٢٠٢٦-٠٤٢٨',
    status: 'confirmed',
  },
  {
    id: 2,
    court: 'محكمة الأحوال الشخصية - عمان',
    type: 'عقد زواج',
    date: '٥ أيار ٢٠٢٦',
    time: '١١:٠٠ ص',
    number: 'B-٢٠٢٦-٠٥٠٥',
    status: 'pending',
  },
];

export default function AppointmentScreen() {
  const { colors: Colors } = useTheme();
  const { t } = useLanguage();
  const styles = useMemo(() => makeStyles(Colors), [Colors]);

  const STATUS_MAP = {
    confirmed: { label: 'مؤكد', color: Colors.success, bg: '#E8F8F0' },
    pending: { label: 'قيد المعالجة', color: Colors.warning, bg: '#FFF8E6' },
    cancelled: { label: 'ملغي', color: Colors.error, bg: '#FDECEA' },
  };

  const [activeTab, setActiveTab] = useState('book'); // 'book' | 'my'
  const [selectedCourt, setSelectedCourt] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [successModal, setSuccessModal] = useState(false);
  const [govFilter, setGovFilter] = useState('all');

  const govOptions = useMemo(
    () => [{ id: 'all', name: t('common.all') }, ...GOVERNORATES],
    [t]
  );
  const filteredCourts = useMemo(
    () => (govFilter === 'all' ? COURTS : COURTS.filter((c) => c.governorate === govFilter)),
    [govFilter]
  );

  const handleBook = () => {
    if (selectedCourt && selectedService) {
      setSuccessModal(true);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primaryDark} />

      {/* Header */}
      <LinearGradient colors={[Colors.primaryDark, Colors.primary]} style={styles.header}>
        <Text style={styles.headerTitle}>{t('appointment.title')}</Text>
        <Text style={styles.headerSub}>{t('appointment.subtitle')}</Text>
      </LinearGradient>

      {/* Tabs */}
      <View style={styles.tabRow}>
        <TouchableOpacity
          style={[styles.tabBtn, activeTab === 'my' && styles.tabBtnActive]}
          onPress={() => setActiveTab('my')}
        >
          <Text style={[styles.tabBtnText, activeTab === 'my' && styles.tabBtnTextActive]}>
            {t('appointment.myAppointments')}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabBtn, activeTab === 'book' && styles.tabBtnActive]}
          onPress={() => setActiveTab('book')}
        >
          <Text style={[styles.tabBtnText, activeTab === 'book' && styles.tabBtnTextActive]}>
            {t('appointment.newAppointment')}
          </Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'book' ? (
        <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
          {/* Service Type */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('appointment.selectService')}</Text>
            <View style={styles.serviceGrid}>
              {SERVICE_TYPES.map((s) => (
                <TouchableOpacity
                  key={s.id}
                  style={[
                    styles.serviceBox,
                    selectedService?.id === s.id && styles.serviceBoxActive,
                    selectedService?.id === s.id && { borderColor: s.color },
                  ]}
                  onPress={() => setSelectedService(s)}
                  activeOpacity={0.8}
                >
                  <MaterialCommunityIcons
                    name={s.icon}
                    size={24}
                    color={selectedService?.id === s.id ? s.color : Colors.textLight}
                  />
                  <Text
                    style={[
                      styles.serviceBoxText,
                      selectedService?.id === s.id && { color: s.color, fontWeight: Fonts.bold },
                    ]}
                  >
                    {s.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Governorate Filter */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('appointment.selectCourt')}</Text>
            <ScrollView horizontal inverted showsHorizontalScrollIndicator={false} style={styles.filterRow}>
              {govOptions.map((gov) => (
                <TouchableOpacity
                  key={gov.id}
                  style={[styles.filterChip, govFilter === gov.id && styles.filterChipActive]}
                  onPress={() => setGovFilter(gov.id)}
                >
                  <Text
                    style={[
                      styles.filterChipText,
                      govFilter === gov.id && styles.filterChipTextActive,
                    ]}
                  >
                    {gov.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Courts */}
          <View style={[styles.section, { paddingTop: 0 }]}>
            {filteredCourts.length === 0 ? (
              <View style={styles.emptyState}>
                <Ionicons name="business-outline" size={42} color={Colors.textMuted} />
                <Text style={styles.emptyTitle}>{t('appointment.noCourts')}</Text>
                <Text style={styles.emptySub}>{t('common.tryDifferentFilter')}</Text>
              </View>
            ) : (
              filteredCourts.map((court) => (
                <TouchableOpacity
                  key={court.id}
                  style={[
                    styles.courtCard,
                    selectedCourt?.id === court.id && styles.courtCardActive,
                  ]}
                  onPress={() => setSelectedCourt(court)}
                  activeOpacity={0.8}
                >
                  <View style={styles.courtLeft}>
                    <View
                      style={[
                        styles.courtRadio,
                        selectedCourt?.id === court.id && styles.courtRadioActive,
                      ]}
                    >
                      {selectedCourt?.id === court.id && (
                        <View style={styles.courtRadioInner} />
                      )}
                    </View>
                  </View>
                  <View style={styles.courtInfo}>
                    <Text style={styles.courtName}>{court.name}</Text>
                    <Text style={styles.courtCity}>
                      <Ionicons name="location-outline" size={12} color={Colors.textLight} />{' '}
                      {court.city} · {court.type}
                    </Text>
                  </View>
                  <View style={styles.courtAvail}>
                    <Text style={styles.courtAvailNum}>{court.available}</Text>
                    <Text style={styles.courtAvailLabel}>{t('appointment.available', { count: court.available })}</Text>
                  </View>
                </TouchableOpacity>
              ))
            )}
          </View>

          {/* CTA */}
          <View style={[styles.section, { paddingBottom: Spacing.xxxl }]}>
            <TouchableOpacity
              style={[
                styles.bookBtn,
                (!selectedCourt || !selectedService) && styles.bookBtnDisabled,
              ]}
              onPress={handleBook}
              disabled={!selectedCourt || !selectedService}
              activeOpacity={0.85}
            >
              <LinearGradient
                colors={
                  selectedCourt && selectedService
                    ? [Colors.primary, Colors.primaryLight]
                    : [Colors.textMuted, Colors.textMuted]
                }
                style={styles.bookBtnGrad}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Ionicons name="calendar" size={20} color={Colors.white} />
                <Text style={styles.bookBtnText}>{t('appointment.confirm')}</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </ScrollView>
      ) : (
        <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
          <View style={[styles.section, { paddingBottom: Spacing.xxxl }]}>
            {MY_APPOINTMENTS.map((apt) => {
              const status = STATUS_MAP[apt.status];
              return (
                <View key={apt.id} style={styles.aptCard}>
                  <View style={styles.aptTop}>
                    <View style={[styles.aptStatusBadge, { backgroundColor: status.bg }]}>
                      <Text style={[styles.aptStatusText, { color: status.color }]}>
                        {status.label}
                      </Text>
                    </View>
                    <Text style={styles.aptNumber}>{apt.number}</Text>
                  </View>
                  <Text style={styles.aptCourt}>{apt.court}</Text>
                  <Text style={styles.aptType}>{apt.type}</Text>
                  <View style={styles.aptRow}>
                    <View style={styles.aptInfoItem}>
                      <Ionicons name="time-outline" size={15} color={Colors.textLight} />
                      <Text style={styles.aptInfoText}>{apt.time}</Text>
                    </View>
                    <View style={styles.aptInfoItem}>
                      <Ionicons name="calendar-outline" size={15} color={Colors.textLight} />
                      <Text style={styles.aptInfoText}>{apt.date}</Text>
                    </View>
                  </View>
                  <View style={styles.aptActions}>
                    <TouchableOpacity style={styles.aptActionCancel}>
                      <Text style={styles.aptActionCancelText}>{t('common.cancel')}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.aptActionPrimary}>
                      <Text style={styles.aptActionPrimaryText}>{t('service.details')}</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })}
          </View>
        </ScrollView>
      )}

      {/* Success Modal */}
      <Modal visible={successModal} transparent animationType="fade">
        <Pressable style={styles.modalOverlay} onPress={() => setSuccessModal(false)}>
          <View style={styles.modalBox}>
            <View style={styles.successIcon}>
              <Ionicons name="checkmark-circle" size={56} color={Colors.success} />
            </View>
            <Text style={styles.modalTitle}>{t('appointment.confirm')}</Text>
            <Text style={styles.modalSub}>
              {selectedCourt?.name}
            </Text>
            <Text style={styles.modalNum}>A-٢٠٢٦-{Math.floor(Math.random() * 9000 + 1000)}</Text>
            <TouchableOpacity
              style={styles.modalBtn}
              onPress={() => {
                setSuccessModal(false);
                setSelectedCourt(null);
                setSelectedService(null);
                setActiveTab('my');
              }}
            >
              <Text style={styles.modalBtnText}>{t('appointment.myAppointments')}</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

function makeStyles(Colors) {
  return StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scroll: { flex: 1 },
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
  tabRow: {
    flexDirection: 'row',
    backgroundColor: Colors.cardBg,
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: Spacing.sm,
    alignItems: 'center',
    borderRadius: Radius.md,
  },
  tabBtnActive: {
    backgroundColor: Colors.accentLight,
  },
  tabBtnText: {
    fontSize: Fonts.sm,
    color: Colors.textLight,
    fontWeight: Fonts.medium,
  },
  tabBtnTextActive: {
    color: Colors.primary,
    fontWeight: Fonts.bold,
  },
  section: {
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.base,
  },
  sectionTitle: {
    fontSize: Fonts.base,
    fontWeight: Fonts.bold,
    color: Colors.textDark,
    textAlign: 'right',
    marginBottom: Spacing.md,
  },
  serviceGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    justifyContent: 'space-between',
  },
  serviceBox: {
    width: '30%',
    backgroundColor: Colors.cardBg,
    borderRadius: Radius.md,
    padding: Spacing.md,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: Colors.border,
    gap: Spacing.xs,
  },
  serviceBoxActive: {
    backgroundColor: Colors.accentLight,
  },
  serviceBoxText: {
    fontSize: Fonts.xs,
    color: Colors.textLight,
    textAlign: 'center',
  },
  filterRow: {
    marginBottom: Spacing.md,
  },
  filterChip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs + 2,
    borderRadius: Radius.full,
    backgroundColor: Colors.cardBg,
    borderWidth: 1,
    borderColor: Colors.border,
    marginLeft: Spacing.sm,
  },
  filterChipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  filterChipText: {
    fontSize: Fonts.xs,
    color: Colors.textMedium,
    fontWeight: Fonts.medium,
  },
  filterChipTextActive: {
    color: Colors.white,
    fontWeight: Fonts.bold,
  },
  courtCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.cardBg,
    borderRadius: Radius.md,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  courtCardActive: {
    borderColor: Colors.primary,
    backgroundColor: Colors.accentLight,
  },
  courtLeft: {
    marginLeft: Spacing.md,
  },
  courtRadio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  courtRadioActive: {
    borderColor: Colors.primary,
  },
  courtRadioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.primary,
  },
  courtInfo: {
    flex: 1,
    alignItems: 'flex-end',
  },
  courtName: {
    fontSize: Fonts.sm,
    fontWeight: Fonts.semiBold,
    color: Colors.textDark,
    textAlign: 'right',
  },
  courtCity: {
    fontSize: Fonts.xs,
    color: Colors.textLight,
    marginTop: 3,
  },
  courtAvail: {
    alignItems: 'center',
    marginRight: Spacing.sm,
  },
  courtAvailNum: {
    fontSize: Fonts.md,
    fontWeight: Fonts.bold,
    color: Colors.primary,
  },
  courtAvailLabel: {
    fontSize: 9,
    color: Colors.textMuted,
  },
  bookBtn: {
    borderRadius: Radius.lg,
    overflow: 'hidden',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  bookBtnGrad: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.base,
    gap: Spacing.sm,
  },
  bookBtnDisabled: { opacity: 0.7 },
  bookBtnText: {
    color: Colors.white,
    fontSize: Fonts.base,
    fontWeight: Fonts.bold,
  },
  aptCard: {
    backgroundColor: Colors.cardBg,
    borderRadius: Radius.lg,
    padding: Spacing.base,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 6,
    elevation: 2,
  },
  aptTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  aptNumber: {
    fontSize: Fonts.xs,
    color: Colors.textMuted,
  },
  aptStatusBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    borderRadius: Radius.full,
  },
  aptStatusText: {
    fontSize: Fonts.xs,
    fontWeight: Fonts.semiBold,
  },
  aptCourt: {
    fontSize: Fonts.base,
    fontWeight: Fonts.bold,
    color: Colors.textDark,
    textAlign: 'right',
    marginBottom: 4,
  },
  aptType: {
    fontSize: Fonts.sm,
    color: Colors.textMedium,
    textAlign: 'right',
    marginBottom: Spacing.sm,
  },
  aptRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: Spacing.base,
  },
  aptInfoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  aptInfoText: {
    fontSize: Fonts.xs,
    color: Colors.textLight,
  },
  aptActions: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginTop: Spacing.md,
  },
  aptActionCancel: {
    flex: 0.4,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.error,
    alignItems: 'center',
  },
  aptActionCancelText: {
    color: Colors.error,
    fontSize: Fonts.sm,
    fontWeight: Fonts.medium,
  },
  aptActionPrimary: {
    flex: 1,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.md,
    backgroundColor: Colors.primary,
    alignItems: 'center',
  },
  aptActionPrimaryText: {
    color: Colors.white,
    fontSize: Fonts.sm,
    fontWeight: Fonts.semiBold,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalBox: {
    backgroundColor: Colors.cardBg,
    borderRadius: Radius.xl,
    padding: Spacing.xxl,
    width: '82%',
    alignItems: 'center',
  },
  successIcon: {
    marginBottom: Spacing.md,
  },
  modalTitle: {
    fontSize: Fonts.xl,
    fontWeight: Fonts.bold,
    color: Colors.textDark,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  modalSub: {
    fontSize: Fonts.sm,
    color: Colors.textMedium,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  modalNum: {
    fontSize: Fonts.sm,
    color: Colors.primary,
    fontWeight: Fonts.semiBold,
    marginBottom: Spacing.lg,
  },
  modalBtn: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: Radius.full,
  },
  modalBtnText: {
    color: Colors.white,
    fontSize: Fonts.base,
    fontWeight: Fonts.bold,
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
});
}
