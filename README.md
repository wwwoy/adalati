# عدالتي - Adalati App

تطبيق React Native (Expo) لخدمات وزارة العدل الأردنية.

## المتطلبات
- Node.js 18+
- Expo CLI: `npm install -g expo-cli`
- Expo Go app on your phone (for testing)

## التثبيت والتشغيل

```bash
# Install dependencies
npm install

# Start development server
npx expo start

# Run on Android
npx expo start --android

# Run on iOS
npx expo start --ios
```

## هيكل المشروع

```
adalati-app/
├── App.js                          # Entry point, RTL setup
├── app.json                        # Expo config
├── package.json
├── babel.config.js
└── src/
    ├── navigation/
    │   └── AppNavigator.js         # Bottom tab navigator (5 tabs)
    ├── screens/
    │   ├── HomeScreen.js           # الرئيسية - Dashboard with services
    │   ├── AppointmentScreen.js    # حجز موعد - Court appointments
    │   ├── NewsScreen.js           # الأخبار - News & announcements
    │   ├── ChatScreen.js           # المساعد - AI Chatbot (Supabase API)
    │   └── AbroadScreen.js         # الخارج - Services abroad
    ├── components/
    │   └── TopBar.js               # Top accessibility bar
    └── theme/
        └── colors.js               # Design tokens & theme
```

## التبويبات (Tabs)

| Tab | الاسم | الوصف |
|-----|--------|-------|
| 1 | الرئيسية | الصفحة الرئيسية مع الخدمات السريعة |
| 2 | حجز موعد | حجز مواعيد في المحاكم الأردنية |
| 3 | الأخبار | أخبار وإعلانات وزارة العدل |
| 4 | المساعد | شات بوت ذكي (Supabase Edge Function) |
| 5 | الخارج | خدمات الأردنيين في الخارج |

## الـ API للشات بوت

يستخدم التطبيق Supabase Edge Function:
- **URL**: `https://jrdxvdiyhsmdrblkmluf.supabase.co/functions/v1/chat`
- **Method**: POST
- **Body**: `{ messages, lang: "ar", sessionId }`

## التصميم

- 🟢 اللون الرئيسي: أخضر وزارة العدل `#1B5E3B`
- 🔤 اللغة: العربية (RTL)
- 📱 يدعم iOS و Android
