import { useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { deleteEntry } from '../api';

export default function EntryDetailScreen({ route, navigation }) {
  const { entry } = route.params;
  const [deleting, setDeleting] = useState(false);

  const formatDate = (iso) => {
    const d = new Date(iso);
    return d.toLocaleDateString('en-SE', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
      + ' · ' + d.toLocaleTimeString('en-SE', { hour: '2-digit', minute: '2-digit' });
  };

  const handleDelete = () => {
    Alert.alert('Delete entry?', "This can't be undone.", [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete', style: 'destructive', onPress: async () => {
          setDeleting(true);
          try {
            await deleteEntry(entry.id);
            navigation.goBack();
          } catch (e) {
            Alert.alert('Error', e.message);
            setDeleting(false);
          }
        },
      },
    ]);
  };

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: entry.photo_url }} style={styles.photo} />
      <View style={styles.content}>
        <Text style={styles.date}>{formatDate(entry.created_at)}</Text>
        {entry.latitude ? (
          <Text style={styles.location}>📍 {entry.latitude}, {entry.longitude}</Text>
        ) : null}
        <View style={styles.divider} />
        <Text style={styles.note}>{entry.note || 'No note added.'}</Text>
        <TouchableOpacity style={styles.deleteBtn} onPress={handleDelete} disabled={deleting}>
          <Text style={styles.deleteBtnText}>{deleting ? 'Deleting...' : 'Delete Entry'}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  photo: { width: '100%', height: 280 },
  content: { padding: 20 },
  date: { fontSize: 15, fontWeight: '600', color: '#111', marginBottom: 4 },
  location: { fontSize: 13, color: '#888', marginBottom: 8 },
  divider: { height: 1, backgroundColor: '#eee', marginVertical: 12 },
  note: { fontSize: 17, color: '#222', lineHeight: 26 },
  deleteBtn: {
    marginTop: 40, padding: 14, borderRadius: 10,
    borderWidth: 1, borderColor: '#ff3b30', alignItems: 'center',
  },
  deleteBtnText: { color: '#ff3b30', fontSize: 16, fontWeight: '500' },
});
