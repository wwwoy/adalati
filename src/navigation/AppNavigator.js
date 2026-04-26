import React, { useEffect, useMemo, useState } from 'react';
import { StyleSheet, Platform, I18nManager } from 'react-native';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

import HomeScreen from '../screens/HomeScreen';
import AppointmentScreen from '../screens/AppointmentScreen';
import NewsScreen from '../screens/NewsScreen';
import ChatScreen from '../screens/ChatScreen';
import AbroadScreen from '../screens/AbroadScreen';
import ProfileScreen from '../screens/ProfileScreen';
import LoginScreen from '../screens/LoginScreen';
import SplashScreen from '../screens/SplashScreen';
import ServiceDetailScreen from '../screens/ServiceDetailScreen';
import ServiceListScreen from '../screens/ServiceListScreen';
import AnnouncementDetailScreen from '../screens/AnnouncementDetailScreen';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';

I18nManager.allowRTL(true);
I18nManager.forceRTL(true);

const Tab = createBottomTabNavigator();
const HomeStack = createNativeStackNavigator();

const TAB_CONFIG = [
  { id: 'home', icon: 'home', iconOutline: 'home-outline', tKey: 'tabs.home' },
  { id: 'appointments', icon: 'calendar', iconOutline: 'calendar-outline', tKey: 'tabs.appointments' },
  { id: 'news', icon: 'newspaper', iconOutline: 'newspaper-outline', tKey: 'tabs.news' },
  { id: 'chat', icon: 'chatbubble-ellipses', iconOutline: 'chatbubble-ellipses-outline', tKey: 'tabs.chat' },
  { id: 'abroad', icon: 'globe', iconOutline: 'globe-outline', tKey: 'tabs.abroad' },
  { id: 'profile', icon: 'person-circle', iconOutline: 'person-circle-outline', tKey: 'tabs.profile' },
];

function HomeStackNav() {
  return (
    <HomeStack.Navigator screenOptions={{ headerShown: false }}>
      <HomeStack.Screen name="HomeMain" component={HomeScreen} />
      <HomeStack.Screen name="ServiceDetail" component={ServiceDetailScreen} />
      <HomeStack.Screen name="ServiceList" component={ServiceListScreen} />
      <HomeStack.Screen name="AnnouncementDetail" component={AnnouncementDetailScreen} />
    </HomeStack.Navigator>
  );
}

const COMPONENTS = {
  home: HomeStackNav,
  appointments: AppointmentScreen,
  news: NewsScreen,
  chat: ChatScreen,
  abroad: AbroadScreen,
  profile: ProfileScreen,
};

function MainTabs() {
  const { colors: Colors } = useTheme();
  const { t } = useLanguage();
  const styles = useMemo(() => makeStyles(Colors), [Colors]);

  return (
    <Tab.Navigator
      initialRouteName="home"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: true,
        tabBarActiveTintColor: Colors.tabActive,
        tabBarInactiveTintColor: Colors.tabInactive,
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabLabel,
        tabBarItemStyle: styles.tabItem,
        tabBarIcon: ({ focused, color }) => {
          const tab = TAB_CONFIG.find((tc) => tc.id === route.name);
          const iconName = focused ? tab.icon : tab.iconOutline;
          return <Ionicons name={iconName} size={focused ? 24 : 22} color={color} />;
        },
      })}
    >
      {TAB_CONFIG.map((tab) => (
        <Tab.Screen
          key={tab.id}
          name={tab.id}
          component={COMPONENTS[tab.id]}
          options={{ tabBarLabel: t(tab.tKey) }}
        />
      ))}
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  const { isAuthenticated } = useAuth();
  const { isDark, colors: Colors } = useTheme();
  const [bootSplash, setBootSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setBootSplash(false), 1400);
    return () => clearTimeout(timer);
  }, []);

  const navTheme = useMemo(() => {
    const base = isDark ? DarkTheme : DefaultTheme;
    return {
      ...base,
      colors: {
        ...base.colors,
        background: Colors.background,
        card: Colors.cardBg,
        text: Colors.textDark,
        border: Colors.border,
        primary: Colors.primary,
      },
    };
  }, [isDark, Colors]);

  if (bootSplash) return <SplashScreen />;

  return (
    <NavigationContainer theme={navTheme}>
      {isAuthenticated ? <MainTabs /> : <LoginScreen />}
    </NavigationContainer>
  );
}

function makeStyles(Colors) {
  return StyleSheet.create({
    tabBar: {
      backgroundColor: Colors.tabBar,
      borderTopWidth: 1,
      borderTopColor: Colors.border,
      height: Platform.OS === 'ios' ? 82 : 62,
      paddingBottom: Platform.OS === 'ios' ? 24 : 8,
      paddingTop: 8,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: -2 },
      shadowOpacity: 0.06,
      shadowRadius: 8,
      elevation: 8,
    },
    tabLabel: {
      fontSize: 10,
      fontWeight: '600',
      marginTop: 2,
    },
    tabItem: {
      paddingVertical: 2,
    },
  });
}
