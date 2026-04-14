import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

export default function PhotoPickerModal({ route, navigation }) {
  const { onPhoto } = route.params;

  const pick = async (source) => {
    try {
      let result;
      if (source === 'camera') {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') { Alert.alert('Camera access denied', 'Enable it in Settings.'); return; }
        result = await ImagePicker.launchCameraAsync({ quality: 0.8, allowsEditing: false });
      } else {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') { Alert.alert('Library access denied', 'Enable it in Settings.'); return; }
        result = await ImagePicker.launchImageLibraryAsync({ quality: 0.8, allowsEditing: false });
      }
      if (!result.canceled) {
        onPhoto(result.assets[0].uri);
        navigation.goBack();
      }
    } catch (e) {
      Alert.alert('Error', e.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add a photo</Text>
      <TouchableOpacity style={styles.option} onPress={() => pick('camera')}>
        <Text style={styles.optionIcon}>📷</Text>
        <Text style={styles.optionText}>Take a photo</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.option} onPress={() => pick('library')}>
        <Text style={styles.optionIcon}>🖼️</Text>
        <Text style={styles.optionText}>Choose from library</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.cancel} onPress={() => navigation.goBack()}>
        <Text style={styles.cancelText}>Cancel</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24, backgroundColor: '#fff' },
  title: { fontSize: 20, fontWeight: '700', textAlign: 'center', marginBottom: 32 },
  option: {
    flexDirection: 'row', alignItems: 'center', padding: 20,
    borderWidth: 1, borderColor: '#eee', borderRadius: 12, marginBottom: 12,
  },
  optionIcon: { fontSize: 28, marginRight: 16 },
  optionText: { fontSize: 17 },
  cancel: { marginTop: 8, padding: 16, alignItems: 'center' },
  cancelText: { color: '#007AFF', fontSize: 16 },
});
