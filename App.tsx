// App entry point. No ThemeProvider — a single fixed calming palette for v1
// (a light/dark flip mid-panic-episode would work against the app's
// purpose; see PROJECT.md). Home is the initial route and renders
// synchronously with no data dependency, so instant launch holds even while
// EntitlementProvider's IAP connection resolves in the background.
import './global.css';
import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { DefaultTheme, NavigationContainer, type Theme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';

import { EntitlementProvider } from './lib/entitlement';
import type { RootStackParamList } from './navigation';

import { BreathingScreen } from './screens/BreathingScreen';
import { GroundingScreen } from './screens/GroundingScreen';
import { HomeScreen } from './screens/HomeScreen';
import { LogScreen } from './screens/LogScreen';
import { PaywallScreen } from './screens/PaywallScreen';
import { SettingsScreen } from './screens/SettingsScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

const BACKGROUND = '#F0F9FA';

const navTheme: Theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: BACKGROUND,
    card: '#FFFFFF',
    text: '#0F172A',
    border: '#D1D5DB',
    primary: '#0D9488',
  },
};

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <EntitlementProvider>
        <SafeAreaProvider>
          <StatusBar style="dark" />
          <NavigationContainer theme={navTheme}>
            <Stack.Navigator
              initialRouteName="Home"
              screenOptions={{ contentStyle: { backgroundColor: BACKGROUND } }}
            >
              <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
              <Stack.Screen
                name="Breathing"
                component={BreathingScreen}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="Grounding"
                component={GroundingScreen}
                options={{ headerShown: false }}
              />
              <Stack.Screen name="Log" component={LogScreen} options={{ title: 'Episode Log' }} />
              <Stack.Screen name="Settings" component={SettingsScreen} options={{ title: 'Settings' }} />
              <Stack.Screen
                name="Paywall"
                component={PaywallScreen}
                options={{ presentation: 'modal', title: 'Unlock BreatheBox' }}
              />
            </Stack.Navigator>
          </NavigationContainer>
        </SafeAreaProvider>
      </EntitlementProvider>
    </GestureHandlerRootView>
  );
}
