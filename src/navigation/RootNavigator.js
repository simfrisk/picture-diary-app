import { useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DiaryHomeScreen from '../screens/DiaryHomeScreen';
import CreateEntryScreen from '../screens/CreateEntryScreen';
import EntryDetailScreen from '../screens/EntryDetailScreen';
import PhotoPickerModal from '../screens/PhotoPickerModal';
import LoginScreen from '../screens/LoginScreen';

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  const [isLoggedIn, setIsLoggedIn] = useState(null); // null = checking

  useEffect(() => {
    SecureStore.getItemAsync('diary_token').then((token) => {
      setIsLoggedIn(!!token);
    });
  }, []);

  // Show a blank loading screen while we check SecureStore
  if (isLoggedIn === null) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (!isLoggedIn) {
    return <LoginScreen onLogin={() => setIsLoggedIn(true)} />;
  }

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="DiaryHome"
        component={DiaryHomeScreen}
        options={{ title: 'My Diary' }}
        initialParams={{ onLogout: () => setIsLoggedIn(false) }}
      />
      <Stack.Screen
        name="CreateEntry"
        component={CreateEntryScreen}
        options={{ title: 'New Entry', presentation: 'modal' }}
      />
      <Stack.Screen
        name="EntryDetail"
        component={EntryDetailScreen}
        options={{ title: 'Entry' }}
      />
      <Stack.Screen
        name="PhotoPicker"
        component={PhotoPickerModal}
        options={{ title: 'Add Photo', presentation: 'modal' }}
      />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff' },
});
