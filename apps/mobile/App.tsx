/**
 * Dreamcatcher Mobile App
 *
 * Quick capture app for ideas on the go
 */

import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Screens
import HomeScreen from './src/screens/HomeScreen';
import LoginScreen from './src/screens/LoginScreen';
import DreamsListScreen from './src/screens/DreamsListScreen';
import DreamDetailScreen from './src/screens/DreamDetailScreen';
import QuickCaptureScreen from './src/screens/QuickCaptureScreen';
import SettingsScreen from './src/screens/SettingsScreen';

// Services
import { AuthContext } from './src/context/AuthContext';
import { ApiService } from './src/services/api';

const Stack = createStackNavigator();

export default function App() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored auth token
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      const userData = await AsyncStorage.getItem('user');

      if (token && userData) {
        setUser(JSON.parse(userData));
        ApiService.setToken(token);
      }
    } catch (error) {
      console.error('Auth check error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const response = await ApiService.login(email, password);
      const { token, user: userData } = response;

      await AsyncStorage.setItem('authToken', token);
      await AsyncStorage.setItem('user', JSON.stringify(userData));

      ApiService.setToken(token);
      setUser(userData);

      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const signOut = async () => {
    await AsyncStorage.removeItem('authToken');
    await AsyncStorage.removeItem('user');
    setUser(null);
    ApiService.setToken(null);
  };

  if (isLoading) {
    return null; // Or loading screen
  }

  return (
    <AuthContext.Provider value={{ user, signIn, signOut }}>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerStyle: {
              backgroundColor: '#667eea',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        >
          {user ? (
            <>
              <Stack.Screen
                name="Home"
                component={HomeScreen}
                options={{ title: '💭 Dreamcatcher' }}
              />
              <Stack.Screen
                name="DreamsList"
                component={DreamsListScreen}
                options={{ title: 'My Dreams' }}
              />
              <Stack.Screen
                name="DreamDetail"
                component={DreamDetailScreen}
                options={{ title: 'Dream Details' }}
              />
              <Stack.Screen
                name="QuickCapture"
                component={QuickCaptureScreen}
                options={{
                  title: 'Quick Capture',
                  presentation: 'modal',
                }}
              />
              <Stack.Screen
                name="Settings"
                component={SettingsScreen}
                options={{ title: 'Settings' }}
              />
            </>
          ) : (
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{ headerShown: false }}
            />
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </AuthContext.Provider>
  );
}
