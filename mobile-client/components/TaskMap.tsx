import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

type TaskMapProps = { coordinates: [number, number] };

export default function TaskMap({ coordinates }: TaskMapProps) {
  return (
    <View style={styles.map}>
      <Text style={styles.pin}>📍</Text>
      <Text style={styles.text}>Task location</Text>
      <Text style={styles.coordinates}>{coordinates[1].toFixed(4)}, {coordinates[0].toFixed(4)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  map: { alignItems: 'center', backgroundColor: '#F8FAFC', borderRadius: 9, height: 220, justifyContent: 'center', width: '100%' },
  pin: { fontSize: 28 },
  text: { color: '#334155', fontSize: 14, fontWeight: '700', marginTop: 6 },
  coordinates: { color: '#94A3B8', fontSize: 12, marginTop: 3 },
});
