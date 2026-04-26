import React, { useMemo, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  StatusBar,
  I18nManager,
  Animated,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Fonts, Spacing, Radius } from '../theme/colors';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';

I18nManager.allowRTL(true);
I18nManager.forceRTL(true);

export default function LoginScreen() {
  const { login } = useAuth();
  const { colors: Colors } = useTheme();
  const { t, lang } = useLanguage();
  const styles = useMemo(() => makeStyles(Colors), [Colors]);
  const isAr = lang === 'ar';
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [filled, setFilled] = useState(false);
  const shake = useRef(new Animated.Value(0)).current;

  const triggerShake = () => {
    Animated.sequence([
      Animated.timing(shake, { toValue: 8, duration: 60, useNativeDriver: true }),
      Animated.timing(shake, { toValue: -8, duration: 60, useNativeDriver: true }),
      Animated.timing(shake, { toValue: 6, duration: 60, useNativeDriver: true }),
      Animated.timing(shake, { toValue: 0, duration: 60, useNativeDriver: true }),
    ]).start();
  };

  const handleSubmit = async () => {
    if (!username.trim() || !password) {
      setError(t('login.errorEmpty'));
      triggerShake();
      return;
    }
    setError('');
    setLoading(true);
    try {
      await login(username, password);
    } catch (e) {
      setError(e.message || t('common.error'));
      triggerShake();
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primaryDark} />
      <LinearGradient
        colors={[Colors.primaryDark, Colors.primary, Colors.primaryLight]}
        style={StyleSheet.absoluteFillObject}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.flex}
        >
          <ScrollView
            contentContainerStyle={styles.scroll}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {/* Brand */}
            <View style={styles.brandWrap}>
              <View style={styles.logoHalo}>
                <Image
                  source={require('../../assets/adalatilogo.png')}
                  style={styles.logoImage}
                  resizeMode="contain"
                />
              </View>
              <Text style={styles.brandTitle}>{t('splash.title')}</Text>
              <Text style={styles.brandSub}>{t('splash.subtitle')}</Text>
            </View>

            {/* Card */}
            <Animated.View style={[styles.card, { transform: [{ translateX: shake }] }]}>
              <Text style={styles.cardTitle}>{t('login.submit')}</Text>
              <Text style={styles.cardSub}>{t('login.welcome')}</Text>

              {/* National ID */}
              <Text style={styles.label}>{t('login.username')}</Text>
              <View style={[styles.inputWrap, error && !username.trim() && styles.inputWrapError]}>
                <Ionicons name="card-outline" size={18} color={Colors.textLight} />
                <TextInput
                  style={styles.input}
                  value={username}
                  onChangeText={(v) => setUsername(v.replace(/[^0-9]/g, ''))}
                  placeholder={t('login.usernamePlaceholder')}
                  placeholderTextColor={Colors.textMuted}
                  keyboardType="number-pad"
                  inputMode="numeric"
                  maxLength={10}
                  autoCapitalize="none"
                  autoCorrect={false}
                  textAlign={isAr ? 'right' : 'left'}
                  returnKeyType="next"
                />
              </View>

              {/* Password */}
              <Text style={[styles.label, { marginTop: Spacing.md }]}>{t('login.password')}</Text>
              <View style={[styles.inputWrap, error && !password && styles.inputWrapError]}>
                <Ionicons name="lock-closed-outline" size={18} color={Colors.textLight} />
                <TextInput
                  style={styles.input}
                  value={password}
                  onChangeText={setPassword}
                  placeholder={t('login.passwordPlaceholder')}
                  placeholderTextColor={Colors.textMuted}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                  textAlign={isAr ? 'right' : 'left'}
                  returnKeyType="done"
                  onSubmitEditing={handleSubmit}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword((v) => !v)}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <Ionicons
                    name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                    size={20}
                    color={Colors.textLight}
                  />
                </TouchableOpacity>
              </View>

              {/* Remember + forgot */}
              <View style={styles.row}>
                <TouchableOpacity onPress={() => {}}>
                  <Text style={styles.forgot}>{t('login.forgot')}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.rememberRow}
                  onPress={() => setRemember((v) => !v)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.rememberText}>{t('login.remember')}</Text>
                  <View style={[styles.checkbox, remember && styles.checkboxActive]}>
                    {remember && <Ionicons name="checkmark" size={14} color={Colors.white} />}
                  </View>
                </TouchableOpacity>
              </View>

              {/* Error */}
              {!!error && (
                <View style={styles.errorBox}>
                  <Ionicons name="alert-circle" size={16} color={Colors.error} />
                  <Text style={styles.errorText}>{error}</Text>
                </View>
              )}

              {/* Submit */}
              <TouchableOpacity
                style={[styles.submit, loading && styles.submitDisabled]}
                onPress={handleSubmit}
                disabled={loading}
                activeOpacity={0.85}
              >
                <LinearGradient
                  colors={[Colors.primary, Colors.primaryLight]}
                  style={styles.submitInner}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  {loading ? (
                    <ActivityIndicator color={Colors.white} />
                  ) : (
                    <>
                      <Ionicons name="log-in-outline" size={20} color={Colors.white} />
                      <Text style={styles.submitText}>{loading ? t('login.submitting') : t('login.submit')}</Text>
                    </>
                  )}
                </LinearGradient>
              </TouchableOpacity>

              {/* Demo Account Card */}
              <View style={styles.demoCard}>
                <View style={styles.demoHeader}>
                  <View style={styles.demoBadge}>
                    <MaterialCommunityIcons name="account-circle-outline" size={14} color={Colors.primary} />
                    <Text style={styles.demoBadgeText}>{t('login.demoTitle')}</Text>
                  </View>
                </View>

                <View style={styles.demoCreds}>
                  <View style={styles.demoCredRow}>
                    <View style={styles.demoCredIcon}>
                      <Ionicons name="card-outline" size={14} color={Colors.primary} />
                    </View>
                    <View style={styles.demoCredBody}>
                      <Text style={styles.demoCredLabel}>{t('login.demoIdLabel')}</Text>
                      <Text style={styles.demoCredValue} selectable>0123456789</Text>
                    </View>
                  </View>
                  <View style={styles.demoCredDivider} />
                  <View style={styles.demoCredRow}>
                    <View style={styles.demoCredIcon}>
                      <Ionicons name="key-outline" size={14} color={Colors.primary} />
                    </View>
                    <View style={styles.demoCredBody}>
                      <Text style={styles.demoCredLabel}>{t('login.demoPasswordLabel')}</Text>
                      <Text style={styles.demoCredValue} selectable>tala</Text>
                    </View>
                  </View>
                </View>

                <TouchableOpacity
                  style={[styles.demoFillBtn, filled && styles.demoFillBtnDone]}
                  onPress={() => {
                    setUsername('0123456789');
                    setPassword('tala');
                    setError('');
                    setFilled(true);
                    setTimeout(() => setFilled(false), 1800);
                  }}
                  activeOpacity={0.85}
                >
                  <Ionicons
                    name={filled ? 'checkmark-circle' : 'flash'}
                    size={16}
                    color={Colors.white}
                  />
                  <Text style={styles.demoFillText}>
                    {filled ? t('login.demoFilled') : t('login.demoFill')}
                  </Text>
                </TouchableOpacity>
              </View>
            </Animated.View>

            {/* Footer */}
            <Text style={styles.footer}>{t('login.footer')}</Text>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

function makeStyles(Colors) {
  return StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.primaryDark },
  safe: { flex: 1 },
  flex: { flex: 1 },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.xl,
    justifyContent: 'center',
  },
  brandWrap: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  logoHalo: {
    width: 150,
    height: 150,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
    shadowColor: Colors.gold,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.55,
    shadowRadius: 24,
    elevation: 12,
  },
  logoImage: { width: 140, height: 140 },
  brandTitle: {
    fontSize: Fonts.xxxl,
    fontWeight: Fonts.bold,
    color: Colors.white,
    letterSpacing: 1,
  },
  brandSub: {
    fontSize: Fonts.sm,
    color: 'rgba(255,255,255,0.85)',
    marginTop: 4,
  },
  card: {
    backgroundColor: Colors.cardBg,
    borderRadius: Radius.xl,
    padding: Spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 24,
    elevation: 12,
  },
  cardTitle: {
    fontSize: Fonts.lg,
    fontWeight: Fonts.bold,
    color: Colors.textDark,
    textAlign: 'right',
  },
  cardSub: {
    fontSize: Fonts.xs,
    color: Colors.textLight,
    textAlign: 'right',
    marginTop: 4,
    marginBottom: Spacing.lg,
  },
  label: {
    fontSize: Fonts.xs,
    color: Colors.textMedium,
    fontWeight: Fonts.semiBold,
    textAlign: 'right',
    marginBottom: 6,
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
    height: 48,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: Spacing.sm,
  },
  inputWrapError: {
    borderColor: Colors.error,
    backgroundColor: '#FFF5F5',
  },
  input: {
    flex: 1,
    fontSize: Fonts.sm,
    color: Colors.textDark,
    paddingVertical: 0,
    textAlign: 'right',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.md,
  },
  rememberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  rememberText: {
    fontSize: Fonts.xs,
    color: Colors.textMedium,
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  forgot: {
    fontSize: Fonts.xs,
    color: Colors.primary,
    fontWeight: Fonts.semiBold,
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    backgroundColor: '#FFF5F5',
    borderWidth: 1,
    borderColor: '#FFCDD2',
    borderRadius: Radius.sm,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.sm,
    marginTop: Spacing.md,
  },
  errorText: {
    flex: 1,
    fontSize: Fonts.xs,
    color: Colors.error,
    textAlign: 'right',
  },
  submit: {
    marginTop: Spacing.lg,
    borderRadius: Radius.md,
    overflow: 'hidden',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  submitDisabled: { opacity: 0.7 },
  submitInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    gap: Spacing.sm,
  },
  submitText: {
    color: Colors.white,
    fontSize: Fonts.base,
    fontWeight: Fonts.bold,
  },
  demoCard: {
    marginTop: Spacing.lg,
    padding: Spacing.md,
    backgroundColor: Colors.accentLight,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.primary + '30',
    borderStyle: 'dashed',
    gap: Spacing.md,
  },
  demoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  demoBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    backgroundColor: Colors.primary + '15',
    borderRadius: Radius.full,
  },
  demoBadgeText: {
    fontSize: Fonts.xs,
    fontWeight: Fonts.bold,
    color: Colors.primary,
    letterSpacing: 0.3,
  },
  demoCreds: {
    backgroundColor: Colors.cardBg,
    borderRadius: Radius.md,
    paddingVertical: 4,
  },
  demoCredRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  demoCredIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.primary + '14',
    alignItems: 'center',
    justifyContent: 'center',
  },
  demoCredBody: {
    flex: 1,
  },
  demoCredLabel: {
    fontSize: 10,
    color: Colors.textLight,
    fontWeight: Fonts.medium,
    textAlign: 'right',
    marginBottom: 2,
  },
  demoCredValue: {
    fontSize: Fonts.base,
    color: Colors.textDark,
    fontWeight: Fonts.bold,
    letterSpacing: 1.2,
    textAlign: 'right',
  },
  demoCredDivider: {
    height: 1,
    backgroundColor: Colors.border,
    marginHorizontal: Spacing.md,
  },
  demoFillBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.sm + 2,
    borderRadius: Radius.md,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  demoFillBtnDone: {
    backgroundColor: Colors.success,
  },
  demoFillText: {
    color: Colors.white,
    fontSize: Fonts.sm,
    fontWeight: Fonts.bold,
    letterSpacing: 0.3,
  },
  hintBold: {
    color: Colors.primary,
    fontWeight: Fonts.bold,
  },
  footer: {
    textAlign: 'center',
    color: 'rgba(255,255,255,0.7)',
    fontSize: 11,
    marginTop: Spacing.xl,
  },
  });
}
