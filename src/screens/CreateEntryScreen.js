import { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, Image, StyleSheet,
  KeyboardAvoidingView, Platform, ScrollView, Alert, ActivityIndicator,
} from 'react-native';
import * as Location from 'expo-location';
import { createEntry } from '../api';

export default function CreateEntryScreen({ navigation }) {
  const [imageUri, setImageUri] = useState(null);
  const [note, setNote] = useState('');
  const [location, setLocation] = useState(null);
  const [locationLabel, setLocationLabel] = useState('Getting location...');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') { setLocationLabel('Location unavailable'); return; }
      try {
        const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
        setLocation(loc.coords);
        const [place] = await Location.reverseGeocodeAsync(loc.coords);
        if (place) setLocationLabel([place.city, place.country].filter(Boolean).join(', '));
        else setLocationLabel('Location captured');
      } catch { setLocationLabel('Location unavailable'); }
    })();
  }, []);

  const handlePickPhoto = () => navigation.navigate('PhotoPicker', { onPhoto: setImageUri });

  const handleSave = async () => {
    if (!imageUri) return;
    setSaving(true);
    try {
      await createEntry({
        imageUri,
        note,
        latitude: location?.latitude,
        longitude: location?.longitude,
      });
      navigation.goBack();
    } catch (e) {
      Alert.alert('Error saving entry', e.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <TouchableOpacity style={[styles.photoArea, imageUri && styles.photoAreaFilled]} onPress={handlePickPhoto}>
          {imageUri
            ? <Image source={{ uri: imageUri }} style={styles.photo} />
            : <Text style={styles.photoPlaceholder}>📷{'\n'}Tap to add photo</Text>}
        </TouchableOpacity>

        <TextInput
          style={styles.input}
          multiline
          placeholder="Write something about this moment..."
          value={note}
          onChangeText={setNote}
        />

        <View style={styles.locationRow}>
          <Text style={styles.locationPin}>📍</Text>
          <Text style={styles.locationText}>{locationLabel}</Text>
        </View>

        <TouchableOpacity
          style={[styles.saveBtn, (!imageUri || saving) && styles.saveBtnDisabled]}
          onPress={handleSave}
          disabled={!imageUri || saving}
        >
          {saving ? <ActivityIndicator color="#fff" /> : <Text style={styles.saveBtnText}>Save Entry</Text>}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  content: { padding: 16 },
  photoArea: {
    height: 220, borderRadius: 12, borderWidth: 2, borderColor: '#ddd',
    borderStyle: 'dashed', alignItems: 'center', justifyContent: 'center', marginBottom: 16,
  },
  photoAreaFilled: { borderWidth: 0 },
  photo: { width: '100%', height: '100%', borderRadius: 12 },
  photoPlaceholder: { fontSize: 15, color: '#aaa', textAlign: 'center', lineHeight: 26 },
  input: {
    minHeight: 100, borderWidth: 1, borderColor: '#eee', borderRadius: 10,
    padding: 12, fontSize: 16, marginBottom: 12, textAlignVertical: 'top',
  },
  locationRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 24 },
  locationPin: { fontSize: 14, marginRight: 4 },
  locationText: { fontSize: 13, color: '#888' },
  saveBtn: {
    backgroundColor: '#007AFF', borderRadius: 12, padding: 16, alignItems: 'center',
  },
  saveBtnDisabled: { backgroundColor: '#aaa' },
  saveBtnText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});
