import React, { useState, useRef, useCallback, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  I18nManager,
  StatusBar,
  Animated,
  Image,
  Alert,
  ActionSheetIOS,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { Fonts, Spacing, Radius } from '../theme/colors';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';

const HISTORY_STORAGE_KEY = '@adalati/chatHistory';

I18nManager.allowRTL(true);
I18nManager.forceRTL(true);

// ─── API Configuration ────────────────────────────────────────────────────────
const API_URL = 'https://jrdxvdiyhsmdrblkmluf.supabase.co/functions/v1/chat';
const API_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpyZHh2ZGl5aHNtZHJibGttbHVmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY1OTcwMDcsImV4cCI6MjA5MjE3MzAwN30.D9NDyNmTcIVVf2tQWb_iHXWThn8LB1i6NLkGU2t6VnU';
const AUTH_TOKEN =
  'eyJhbGciOiJFUzI1NiIsImtpZCI6IjNjNTg1NDY2LTY2ZGQtNGU3NC04MGFiLTQ3ZDE3NWFjYmY3OSIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJodHRwczovL2pyZHh2ZGl5aHNtZHJibGttbHVmLnN1cGFiYXNlLmNvL2F1dGgvdjEiLCJzdWIiOiI3OTNmY2I1OS0xYTBiLTQ4ZGUtYWFjNy0wZGMyZGZiMTU5YmUiLCJhdWQiOiJhdXRoZW50aWNhdGVkIiwiZXhwIjoxNzc3MTk4OTgyLCJpYXQiOjE3NzcxOTUzODIsImVtYWlsIjoiOTk5OTk5OTk5OUBpZC5hZGFsYXRpLmxvY2FsIiwicGhvbmUiOiIiLCJhcHBfbWV0YWRhdGEiOnsicHJvdmlkZXIiOiJlbWFpbCIsInByb3ZpZGVycyI6WyJlbWFpbCJdfSwidXNlcl9tZXRhZGF0YSI6eyJjb3VudHJ5IjoiSk8iLCJmdWxsX25hbWUiOiJKdWRnZSBEZW1vIiwibmF0aW9uYWxfaWQiOiI5OTk5OTk5OTk5IiwicGhvbmUiOiIrOTYyNzkwMDAwMDAwIn0sInJvbGUiOiJhdXRoZW50aWNhdGVkIiwiYWFsIjoiYWFsMSIsImFtciI6W3sibWV0aG9kIjoicGFzc3dvcmQiLCJ0aW1lc3RhbXAiOjE3NzcxOTUzODJ9XSwic2Vzc2lvbl9pZCI6IjZlNTI0ZGRiLTI0MjAtNDVjNy1hM2UyLWYzYTE0NjIyMjI3MiIsImlzX2Fub255bW91cyI6ZmFsc2V9.KkzNqpRw6VAqc4-qcMJ_OTDhcE1Qukv9V1qENbhXtB7nqvoZCy3phdHvl9jFlSs0de4o_lLG7P0nKtDtyWAC4g';
const SESSION_ID = 'r0Sa16hwFqt9r7ge2Yu1Ug';

// ─── Suggested Questions ──────────────────────────────────────────────────────
const SUGGESTIONS_AR = [
  'كيف أحجز موعد في المحكمة؟',
  'وين أستخرج وثيقة زواج؟',
  'شو رسوم الوكالة العدلية؟',
  'كيف أسجّل عقار باسمي؟',
  'كيف أحصل على شهادة ميلاد؟',
  'ما هي مواعيد دوام المحاكم؟',
];

const SUGGESTIONS_EN = [
  'How do I book a court appointment?',
  'Where do I get a marriage certificate?',
  'What are the notary power-of-attorney fees?',
  'How do I register a property?',
  'How do I get a birth certificate?',
  'What are court working hours?',
];

// ─── Message Bubble ───────────────────────────────────────────────────────────
const MessageBubble = React.memo(({ message, styles, Colors }) => {
  const isUser = message.role === 'user';
  return (
    <View style={[styles.bubbleWrapper, isUser ? styles.bubbleRight : styles.bubbleLeft]}>
      {!isUser && (
        <View style={styles.botAvatar}>
          <MaterialCommunityIcons name="robot-happy-outline" size={18} color={Colors.white} />
        </View>
      )}
      <View
        style={[
          styles.bubble,
          isUser ? styles.userBubble : styles.botBubble,
          message.error && styles.errorBubble,
        ]}
      >
        {message.imageUri && (
          <Image
            source={{ uri: message.imageUri }}
            style={styles.bubbleImage}
            resizeMode="cover"
          />
        )}
        {!!message.content && (
          <Text style={[styles.bubbleText, isUser ? styles.userText : styles.botText]}>
            {message.content}
          </Text>
        )}
        <Text style={[styles.bubbleTime, isUser ? styles.userTimeText : styles.botTimeText]}>
          {message.time}
        </Text>
      </View>
      {isUser && (
        <View style={styles.userAvatar}>
          <Ionicons name="person" size={16} color={Colors.white} />
        </View>
      )}
    </View>
  );
});

// ─── Typing Indicator ─────────────────────────────────────────────────────────
const TypingIndicator = ({ styles, Colors }) => {
  const dot1 = useRef(new Animated.Value(0)).current;
  const dot2 = useRef(new Animated.Value(0)).current;
  const dot3 = useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    const animate = (dot, delay) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(dot, { toValue: -6, duration: 300, useNativeDriver: true }),
          Animated.timing(dot, { toValue: 0, duration: 300, useNativeDriver: true }),
          Animated.delay(600),
        ])
      ).start();
    animate(dot1, 0);
    animate(dot2, 150);
    animate(dot3, 300);
  }, []);

  const Dot = ({ anim }) => (
    <Animated.View style={[styles.typingDot, { transform: [{ translateY: anim }] }]} />
  );

  return (
    <View style={[styles.bubbleWrapper, styles.bubbleLeft]}>
      <View style={styles.botAvatar}>
        <MaterialCommunityIcons name="robot-happy-outline" size={18} color={Colors.white} />
      </View>
      <View style={[styles.bubble, styles.botBubble, styles.typingBubble]}>
        <Dot anim={dot1} />
        <Dot anim={dot2} />
        <Dot anim={dot3} />
      </View>
    </View>
  );
};

// ─── Main Chat Screen ─────────────────────────────────────────────────────────
export default function ChatScreen() {
  const { user } = useAuth();
  const { colors: Colors } = useTheme();
  const { t, lang } = useLanguage();
  const styles = useMemo(() => makeStyles(Colors), [Colors]);
  const isAr = lang === 'ar';
  const greetingName = user?.firstName || '';
  const SUGGESTIONS = isAr ? SUGGESTIONS_AR : SUGGESTIONS_EN;

  const buildGreeting = useCallback(
    () => ({
      id: '0',
      role: 'assistant',
      content: t('chat.greeting', { name: greetingName ? ' ' + greetingName : '' }),
      time: formatTime(new Date(), lang),
    }),
    [t, greetingName, lang]
  );

  const [messages, setMessages] = useState([buildGreeting()]);
  const [hydrated, setHydrated] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null); // { uri, base64, mimeType }
  const flatListRef = useRef(null);
  const inputRef = useRef(null);

  // Hydrate stored history on mount
  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(HISTORY_STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setMessages(parsed);
          }
        }
      } catch {}
      setHydrated(true);
    })();
  }, []);

  // Persist on every change (after hydration)
  useEffect(() => {
    if (!hydrated) return;
    AsyncStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(messages)).catch(() => {});
  }, [messages, hydrated]);

  const clearChat = () => {
    Alert.alert(
      isAr ? 'مسح المحادثة' : 'Clear chat',
      isAr
        ? 'هل تريد بالتأكيد حذف جميع الرسائل؟'
        : 'Are you sure you want to delete all messages?',
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: isAr ? 'مسح' : 'Clear',
          style: 'destructive',
          onPress: async () => {
            const fresh = [buildGreeting()];
            setMessages(fresh);
            try {
              await AsyncStorage.removeItem(HISTORY_STORAGE_KEY);
            } catch {}
          },
        },
      ]
    );
  };

  const requestPermission = async (type) => {
    if (type === 'camera') {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      return status === 'granted';
    } else {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      return status === 'granted';
    }
  };

  const pickFromGallery = async () => {
    const granted = await requestPermission('gallery');
    if (!granted) {
      Alert.alert(
        isAr ? 'إذن مطلوب' : 'Permission required',
        isAr ? 'يرجى السماح بالوصول إلى مكتبة الصور من الإعدادات.' : 'Please grant photo library access in settings.'
      );
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      base64: true,
      quality: 0.7,
    });
    if (!result.canceled && result.assets?.length > 0) {
      const asset = result.assets[0];
      setSelectedImage({ uri: asset.uri, base64: asset.base64, mimeType: asset.mimeType || 'image/jpeg' });
    }
  };

  const takePhoto = async () => {
    const granted = await requestPermission('camera');
    if (!granted) {
      Alert.alert(
        isAr ? 'إذن مطلوب' : 'Permission required',
        isAr ? 'يرجى السماح بالوصول إلى الكاميرا من الإعدادات.' : 'Please grant camera access in settings.'
      );
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      base64: true,
      quality: 0.7,
    });
    if (!result.canceled && result.assets?.length > 0) {
      const asset = result.assets[0];
      setSelectedImage({ uri: asset.uri, base64: asset.base64, mimeType: asset.mimeType || 'image/jpeg' });
    }
  };

  const showAttachMenu = () => {
    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: [t('common.cancel'), t('chat.gallery'), t('chat.camera')],
          cancelButtonIndex: 0,
        },
        (index) => {
          if (index === 1) pickFromGallery();
          else if (index === 2) takePhoto();
        }
      );
    } else {
      Alert.alert(t('chat.attach'), '', [
        { text: t('common.cancel'), style: 'cancel' },
        { text: t('chat.gallery'), onPress: pickFromGallery },
        { text: t('chat.camera'), onPress: takePhoto },
      ]);
    }
  };

  function formatTime(date, langCode) {
    return date.toLocaleTimeString(langCode === 'en' ? 'en-US' : 'ar-JO', { hour: '2-digit', minute: '2-digit' });
  }

  const sendMessage = useCallback(
    async (text) => {
      const messageText = (text || input).trim();
      const imageToSend = selectedImage;
      if ((!messageText && !imageToSend) || loading) return;

      const userMsg = {
        id: Date.now().toString(),
        role: 'user',
        content: messageText,
        imageUri: imageToSend?.uri || null,
        time: formatTime(new Date(), lang),
      };

      setMessages((prev) => [...prev, userMsg]);
      setInput('');
      setSelectedImage(null);
      setLoading(true);

      // Build history for API (exclude initial greeting)
      const formattedHistory = messages
        .slice(1)
        .map(({ role, content }) => ({
          role: role === 'assistant' ? 'model' : 'user',
          parts: [{ text: content || '' }],
        }));

      // Build current user parts (image + text)
      const currentParts = [];
      if (imageToSend?.base64) {
        currentParts.push({
          inline_data: { mime_type: imageToSend.mimeType, data: imageToSend.base64 },
        });
      }
      if (messageText) currentParts.push({ text: messageText });
      formattedHistory.push({ role: 'user', parts: currentParts });

      try {
        const systemPromptAr = `اسم المستخدمة هو ${user?.fullName || 'تالا جرادات'} وهي من الأردن${user?.city ? ` (مدينة ${user.city})` : ''}. خاطبها باسمها عند الحاجة وقدم ردوداً مناسبة لها كمواطنة أردنية. اجعل ردودك باللغة العربية الفصحى أو العامية الأردنية حسب أسلوبها في السؤال.`;
        const systemPromptEn = `The user's name is ${user?.fullName || 'Tala Jaradat'} and she is from Jordan${user?.city ? ` (${user.city})` : ''}. Address her by name when appropriate and provide answers suitable for a Jordanian citizen seeking Ministry of Justice services. Always respond in clear, professional English.`;
        const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-goog-api-key': 'AIzaSyB7xTDQPufnvHOvEBTlRwsjsg9lCLEiid4',
          },
          body: JSON.stringify({
            system_instruction: {
              parts: [{ text: isAr ? systemPromptAr : systemPromptEn }],
            },
            contents: formattedHistory,
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const data = await response.json();
        const botContent = data?.candidates?.[0]?.content?.parts?.[0]?.text || 'عذراً، لم أتلقَّ ردًّا. حاول مجدداً.';

        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: botContent,
            time: formatTime(new Date()),
          },
        ]);
      } catch (err) {
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: 'عذراً، حصل خطأ في الاتصال. تأكد من الإنترنت وحاول مجدداً.',
            time: formatTime(new Date()),
            error: true,
          },
        ]);
      } finally {
        setLoading(false);
        setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
      }
    },
    [input, loading, messages, selectedImage, isAr, t, lang, user]
  );

  const handleSuggestion = (text) => sendMessage(text);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primaryDark} />

      {/* Header */}
      <LinearGradient
        colors={[Colors.primaryDark, Colors.primary]}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <View style={styles.headerRight}>
            <View style={styles.headerAvatar}>
              <MaterialCommunityIcons name="robot-happy-outline" size={26} color={Colors.gold} />
            </View>
            <View>
              <Text style={styles.headerTitle}>{t('chat.title')}</Text>
              <View style={styles.onlineRow}>
                <View style={styles.onlineDot} />
                <Text style={styles.onlineText}>{t('chat.subtitle')}</Text>
              </View>
            </View>
          </View>
          <View style={styles.headerBadge}>
            <TouchableOpacity
              onPress={clearChat}
              hitSlop={8}
              activeOpacity={0.7}
              accessibilityLabel={isAr ? 'مسح المحادثة' : 'Clear chat'}
              disabled={messages.length <= 1}
              style={messages.length <= 1 && { opacity: 0.4 }}
            >
              <Ionicons name="trash-outline" size={18} color={Colors.white} />
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={0}
      >
        {/* Messages */}
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <MessageBubble message={item} styles={styles} Colors={Colors} />}
          contentContainerStyle={styles.messageList}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={loading ? <TypingIndicator styles={styles} Colors={Colors} /> : null}
        />

        {/* Suggestions */}
        {messages.length <= 1 && (
          <View style={styles.suggestionsWrap}>
            <Text style={styles.suggestionsLabel}>{isAr ? 'اقتراحات:' : 'Suggestions:'}</Text>
            <FlatList
              data={SUGGESTIONS}
              horizontal
              inverted
              keyExtractor={(_, i) => i.toString()}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.suggestionsList}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.suggestionChip}
                  onPress={() => handleSuggestion(item)}
                  activeOpacity={0.75}
                >
                  <Text style={styles.suggestionText}>{item}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        )}

        {/* Image Preview */}
        {selectedImage && (
          <View style={styles.imagePreviewBar}>
            <TouchableOpacity
              style={styles.imagePreviewRemove}
              onPress={() => setSelectedImage(null)}
            >
              <Ionicons name="close-circle" size={20} color={Colors.white} />
            </TouchableOpacity>
            <Image source={{ uri: selectedImage.uri }} style={styles.imagePreviewThumb} resizeMode="cover" />
            <Text style={styles.imagePreviewLabel}>{isAr ? 'صورة مرفقة' : 'Attached image'}</Text>
          </View>
        )}

        {/* Input Bar */}
        <View style={styles.inputBar}>
          <TouchableOpacity
            style={[styles.sendBtn, ((!input.trim() && !selectedImage) || loading) && styles.sendBtnDisabled]}
            onPress={() => sendMessage()}
            disabled={(!input.trim() && !selectedImage) || loading}
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator size="small" color={Colors.white} />
            ) : (
              <Ionicons
                name="send"
                size={20}
                color={Colors.white}
                style={{ transform: [{ scaleX: -1 }] }}
              />
            )}
          </TouchableOpacity>

          <TextInput
            ref={inputRef}
            style={styles.textInput}
            value={input}
            onChangeText={setInput}
            placeholder={t('chat.placeholder')}
            placeholderTextColor={Colors.textMuted}
            multiline
            maxLength={500}
            textAlign="right"
            onSubmitEditing={() => sendMessage()}
          />

          <TouchableOpacity style={styles.attachBtn} onPress={showAttachMenu} activeOpacity={0.7}>
            <Ionicons name="attach" size={22} color={Colors.textLight} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function makeStyles(Colors) {
  return StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  flex: { flex: 1 },

  // Header
  header: {
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  headerAvatar: {
    width: 46,
    height: 46,
    borderRadius: Radius.full,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.3)',
    marginLeft: Spacing.md,
  },
  headerTitle: {
    color: Colors.white,
    fontSize: Fonts.md,
    fontWeight: Fonts.bold,
    textAlign: 'right',
  },
  onlineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    justifyContent: 'flex-end',
  },
  onlineDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#4ade80',
  },
  onlineText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: Fonts.xs,
  },
  headerBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: Radius.full,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  headerBadgeText: {
    color: Colors.white,
    fontSize: Fonts.xs,
    fontWeight: Fonts.semiBold,
  },

  // Messages
  messageList: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.base,
    paddingBottom: Spacing.lg,
  },
  bubbleWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: Spacing.md,
  },
  bubbleLeft: {
    justifyContent: 'flex-start',
  },
  bubbleRight: {
    justifyContent: 'flex-end',
  },
  botAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: Spacing.sm,
    flexShrink: 0,
  },
  userAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.sm,
    flexShrink: 0,
  },
  bubble: {
    maxWidth: '78%',
    borderRadius: Radius.lg,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    paddingBottom: Spacing.xs + 2,
  },
  userBubble: {
    backgroundColor: Colors.primary,
    borderBottomRightRadius: 4,
  },
  botBubble: {
    backgroundColor: Colors.cardBg,
    borderBottomLeftRadius: 4,
    shadowColor: 'rgba(0,0,0,0.08)',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 1,
    shadowRadius: 3,
    elevation: 2,
  },
  errorBubble: {
    backgroundColor: Colors.tintPink,
    borderWidth: 1,
    borderColor: Colors.error,
  },
  bubbleText: {
    fontSize: Fonts.sm,
    lineHeight: 22,
    textAlign: 'right',
  },
  userText: {
    color: Colors.white,
  },
  botText: {
    color: Colors.textDark,
  },
  bubbleTime: {
    fontSize: 10,
    marginTop: 4,
    textAlign: 'left',
  },
  userTimeText: {
    color: 'rgba(255,255,255,0.65)',
  },
  botTimeText: {
    color: Colors.textMuted,
  },

  // Typing
  typingBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.base,
    gap: 5,
  },
  typingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary,
  },

  // Suggestions
  suggestionsWrap: {
    paddingHorizontal: Spacing.base,
    paddingBottom: Spacing.sm,
  },
  suggestionsLabel: {
    fontSize: Fonts.xs,
    color: Colors.textLight,
    textAlign: 'right',
    marginBottom: Spacing.xs,
  },
  suggestionsList: {
    gap: Spacing.sm,
    paddingLeft: Spacing.sm,
  },
  suggestionChip: {
    backgroundColor: Colors.cardBg,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 1,
    shadowRadius: 3,
    elevation: 1,
  },
  suggestionText: {
    fontSize: Fonts.xs,
    color: Colors.primary,
    fontWeight: Fonts.medium,
  },

  // Input
  inputBar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: Colors.cardBg,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    gap: Spacing.sm,
  },
  textInput: {
    flex: 1,
    minHeight: 42,
    maxHeight: 100,
    backgroundColor: Colors.background,
    borderRadius: Radius.xl,
    paddingHorizontal: Spacing.md,
    paddingVertical: Platform.OS === 'ios' ? 10 : 6,
    fontSize: Fonts.sm,
    color: Colors.textDark,
    borderWidth: 1,
    borderColor: Colors.border,
    textAlignVertical: 'center',
  },
  sendBtn: {
    width: 42,
    height: 42,
    borderRadius: Radius.full,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  sendBtnDisabled: {
    backgroundColor: Colors.textMuted,
  },
  attachBtn: {
    width: 42,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },

  // Image in bubble
  bubbleImage: {
    width: 200,
    height: 150,
    borderRadius: Radius.md,
    marginBottom: Spacing.xs,
  },

  // Image preview bar above input
  imagePreviewBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    gap: Spacing.sm,
  },
  imagePreviewThumb: {
    width: 48,
    height: 48,
    borderRadius: Radius.sm,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  imagePreviewLabel: {
    flex: 1,
    color: Colors.white,
    fontSize: Fonts.sm,
    textAlign: 'right',
  },
  imagePreviewRemove: {
    padding: 2,
  },
});
}
