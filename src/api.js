import * as SecureStore from 'expo-secure-store';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';

const BASE_URL = 'https://7354c302e7.apps.osaas.io';

async function getDeviceId() {
  let id = await SecureStore.getItemAsync('device_id');
  if (!id) {
    id = uuidv4();
    await SecureStore.setItemAsync('device_id', id);
  }
  return id;
}

async function authHeaders() {
  const deviceId = await getDeviceId();
  return { 'X-Device-ID': deviceId };
}

export async function getEntries() {
  const headers = await authHeaders();
  const res = await fetch(`${BASE_URL}/entries`, { headers });
  return res.json();
}

export async function createEntry({ imageUri, note, latitude, longitude }) {
  const headers = await authHeaders();
  const formData = new FormData();
  formData.append('photo', { uri: imageUri, type: 'image/jpeg', name: 'photo.jpg' });
  if (note) formData.append('note', note);
  if (latitude != null) formData.append('latitude', String(latitude));
  if (longitude != null) formData.append('longitude', String(longitude));

  const res = await fetch(`${BASE_URL}/entries`, {
    method: 'POST',
    headers,
    body: formData,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error);
  return data;
}

export async function deleteEntry(id) {
  const headers = await authHeaders();
  await fetch(`${BASE_URL}/entries/${id}`, { method: 'DELETE', headers });
}
