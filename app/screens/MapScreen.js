import React, { useEffect, useState } from 'react';
import MapView, { Marker } from 'react-native-maps';
import { StyleSheet, View } from 'react-native';
import * as Location from 'expo-location';

import { StyledButton, ButtonText } from '../components/styles'

export default function MapScreen({navigation, route}) {
    const {storeName, location} = route.params
    const [mapRegion, setMapRegion] = useState({
        latitude: 8.477217,
        longitude: 124.645920,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
    });
    const [mlocation, setLocation] = useState();
    const [address, setAddress] = useState();

    const userLocation = async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if(status !== 'granted'){
            setErrorMsg('Permission to access location was denied.');
        }
        let mylocation = await Location.getCurrentPositionAsync({enableHighAccuracy: true});
        setMapRegion({
            latitude: mylocation.coords.latitude,
            longitude: mylocation.coords.longitude,
            latitudeDelta: 0.012,
            longitudeDelta: 0.012,
        });
        setLocation(mylocation);
    }

    const getAddress = async (loc) => {
        const myAddress = await Location.reverseGeocodeAsync({
            latitude: loc.coords?.latitude,
            longitude: loc.coords?.longitude,
        })
        setAddress(myAddress);
    }


    useEffect(() => {
        userLocation();
    }, [])

  return (
    <View style={styles.container}>
      <MapView style={styles.map} region={mapRegion}> 
        <Marker 
            draggable 
            coordinate={mapRegion} 
            title="My Address" 
            onDrag={(e) => {
                let coordinate = {coords: e.nativeEvent.coordinate};
                
                setMapRegion({
                    latitude: coordinate.latitude,
                    longitude: coordinate.longitude,
                });
                setLocation(coordinate);
            }}
        />
      </MapView>
      <StyledButton onPress={() => {
        const locDet = `Latitude: ${mlocation.coords.latitude}  -  Longitude: ${mlocation.coords.longitude}`
        const loc = {latitude: mlocation.coords.latitude, longitude: mlocation.coords.longitude}
        navigation.navigate('AddStoreDetailsScreen', {storeName,locDetails: locDet, location: loc})
      }}>
        <ButtonText>Set Address</ButtonText>
      </StyledButton>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '90%',
  },
});