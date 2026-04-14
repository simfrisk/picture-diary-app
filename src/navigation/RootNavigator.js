import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DiaryHomeScreen from '../screens/DiaryHomeScreen';
import CreateEntryScreen from '../screens/CreateEntryScreen';
import EntryDetailScreen from '../screens/EntryDetailScreen';
import PhotoPickerModal from '../screens/PhotoPickerModal';

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="DiaryHome"
        component={DiaryHomeScreen}
        options={{ title: 'My Diary' }}
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
