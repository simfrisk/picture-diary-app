import { useCallback, useEffect, useState } from 'react';
import {
  FlatList, Image, StyleSheet, Text, TouchableOpacity, View, RefreshControl, Alert,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import * as SecureStore from 'expo-secure-store';
import { getEntries } from '../api';

export default function DiaryHomeScreen({ navigation, route }) {
  const [entries, setEntries] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const onLogout = route.params?.onLogout;

  // Set up the logout button in the header
  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={handleLogout} style={styles.logoutBtn}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  const handleLogout = async () => {
    await SecureStore.deleteItemAsync('diary_token');
    if (onLogout) {
      onLogout();
    }
  };

  const load = useCallback(async () => {
    try {
      const data = await getEntries();
      setEntries(data);
    } catch (e) {
      Alert.alert('Error', e.message);
    }
  }, []);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  const onRefresh = async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  };

  const formatDate = (iso) => {
    const d = new Date(iso);
    return d.toLocaleDateString('en-SE', { day: 'numeric', month: 'long', year: 'numeric' })
      + ' · ' + d.toLocaleTimeString('en-SE', { hour: '2-digit', minute: '2-digit' });
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('EntryDetail', { entry: item })}>
      <Image source={{ uri: item.photo_url }} style={styles.thumb} />
      <View style={styles.cardText}>
        <Text style={styles.date}>{formatDate(item.created_at)}</Text>
        <Text style={styles.note} numberOfLines={2}>{item.note || 'No note'}</Text>
        {item.latitude ? <Text style={styles.location}>📍 {item.latitude.toFixed(4)}, {item.longitude.toFixed(4)}</Text> : null}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {entries.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyIcon}>📖</Text>
          <Text style={styles.emptyTitle}>Your diary is empty</Text>
          <Text style={styles.emptySubtitle}>Tap + to add your first memory.</Text>
        </View>
      ) : (
        <FlatList
          data={entries}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderItem}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        />
      )}
      <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('CreateEntry')}>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  card: { flexDirection: 'row', padding: 12, borderBottomWidth: 1, borderBottomColor: '#eee' },
  thumb: { width: 64, height: 64, borderRadius: 8, marginRight: 12 },
  cardText: { flex: 1, justifyContent: 'center' },
  date: { fontSize: 13, fontWeight: '600', color: '#111', marginBottom: 2 },
  note: { fontSize: 13, color: '#555' },
  location: { fontSize: 11, color: '#999', marginTop: 2 },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  emptyIcon: { fontSize: 64, marginBottom: 16 },
  emptyTitle: { fontSize: 20, fontWeight: '600', color: '#111' },
  emptySubtitle: { fontSize: 15, color: '#888', marginTop: 4 },
  fab: {
    position: 'absolute', right: 24, bottom: 40,
    width: 56, height: 56, borderRadius: 28,
    backgroundColor: '#007AFF', alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.3, shadowRadius: 4,
    elevation: 5,
  },
  fabText: { fontSize: 28, color: '#fff', lineHeight: 32 },
  logoutBtn: { marginRight: 4, paddingHorizontal: 8, paddingVertical: 4 },
  logoutText: { fontSize: 15, color: '#007AFF' },
});
