import React, { useEffect, useState } from 'react';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import * as Location from 'expo-location';

import { StyledButton, ButtonText, ExtraText, StyledContainer, DashboardContainer } from '../components/styles'

export default function MapScreen({navigation, route}) {
    const {storeName, location} = route.params
    const [mapRegion, setMapRegion] = useState({
        latitude: 8.477217,
        longitude: 124.645920,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
    });
    const [mlocation, setLocation] = useState(null);
    const [isLocationChecking, setIsLocationChecking] = useState(true);
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
        setIsLocationChecking(false);
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

      { !isLocationChecking && <MapView 
        style={styles.map} 
        region={mapRegion}
        provider={PROVIDER_GOOGLE}
      > 
        <Marker 
            draggable 
            coordinate={mapRegion} 
            title="My Address" 
            onDragEnd={(e) => {
                let coordinate = {coords: e.nativeEvent.coordinate};
                
                setMapRegion({
                    latitude: coordinate.coords.latitude,
                    longitude: coordinate.coords.longitude,
                    latitudeDelta: 0.012,
                    longitudeDelta: 0.012,
                });
                setLocation(coordinate);
            }}
        />
      </MapView>}

      { isLocationChecking && <StyledContainer>
        <DashboardContainer>
          <ActivityIndicator size="large" color="#000"/>
          <ButtonText mapLoading={true}>Fetching your location... </ButtonText>
        </DashboardContainer>
      </StyledContainer>}

        
      <ExtraText map={true}>Drag the marker to your store location.</ExtraText>

      <StyledButton map={true} onPress={() => {
        if(mlocation !== null){
          const locDet = `Latitude: ${mlocation.coords.latitude}  -  Longitude: ${mlocation.coords.longitude}`
          const loc = {latitude: mlocation.coords.latitude, longitude: mlocation.coords.longitude}
          navigation.navigate('AddStoreDetailsScreen', {storeName,locDetails: locDet, location: loc})
        }
      }}>
        <ButtonText map={true}>SET STORE LOCATION</ButtonText>
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
    height: '100%',
  },
});