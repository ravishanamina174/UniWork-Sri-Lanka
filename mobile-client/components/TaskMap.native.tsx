import React from 'react';
import MapView, { Marker } from 'react-native-maps';
import { StyleSheet } from 'react-native';

type TaskMapProps = { coordinates: [number, number] };

export default function TaskMap({ coordinates }: TaskMapProps) {
  const [longitude, latitude] = coordinates;
  return (
    <MapView
      style={styles.map}
      initialRegion={{ latitude, longitude, latitudeDelta: 0.02, longitudeDelta: 0.02 }}
      scrollEnabled={false}
      zoomEnabled={false}
    >
      <Marker coordinate={{ latitude, longitude }} />
    </MapView>
  );
}

const styles = StyleSheet.create({ map: { height: 220, width: '100%', borderRadius: 9 } });
