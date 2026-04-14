import * as SecureStore from 'expo-secure-store';

const BASE_URL = 'https://picture-diary-api.apps.liivo.ai'; // update after Liivo deployment

async function getToken() {
  return await SecureStore.getItemAsync('diary_token');
}

export async function login(password) {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error);
  await SecureStore.setItemAsync('diary_token', data.token);
  return data.token;
}

export async function getEntries() {
  const token = await getToken();
  const res = await fetch(`${BASE_URL}/entries`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
}

export async function createEntry({ imageUri, note, latitude, longitude }) {
  const token = await getToken();
  const formData = new FormData();
  formData.append('photo', { uri: imageUri, type: 'image/jpeg', name: 'photo.jpg' });
  if (note) formData.append('note', note);
  if (latitude != null) formData.append('latitude', String(latitude));
  if (longitude != null) formData.append('longitude', String(longitude));

  const res = await fetch(`${BASE_URL}/entries`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error);
  return data;
}

export async function deleteEntry(id) {
  const token = await getToken();
  await fetch(`${BASE_URL}/entries/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
}
