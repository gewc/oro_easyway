import React, { useEffect, useState } from 'react';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import * as Location from 'expo-location';

import { Colors, ButtonText, ExtraText, StyledContainer, DashboardContainer } from '../components/styles'
import {MaterialIcons} from '@expo/vector-icons' 

import axios from 'axios'
axios.defaults.baseURL = 'https://oro-easyway.onrender.com/api/v1';

const { primary, brand, darkLight } = Colors;

export default function MaterialSearchMapScreen({navigation, route}) {
    const {searchText} = route.params
    const [mapRegion, setMapRegion] = useState({
        latitude: 8.477217,
        longitude: 124.645920,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
    });
    const [mlocation, setLocation] = useState(null);
    const [isLocationChecking, setIsLocationChecking] = useState(false);

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

    const getHardwareStore = async () => {
      await axios.get('/products/materialsearch/'+searchText)
        .then((response) => {
            const result = response.data;
            const { message, status, data } = result;
            console.log(data)

            if(status !== "SUCCESS"){
                // handleMessage(message, status)
            } else {
                // handleMessage(message, status)
            }
            setIsLocationChecking(false);
        })
        .catch( error => {
            console.log(error.message)
            setIsLocationChecking(false);
            // handleMessage("An error occured. Check your network and try again!")
        });
    }


    useEffect(() => {
        userLocation();
        getHardwareStore();
    }, [])

  return (
    <View style={styles.container}>

      { !isLocationChecking && <MapView 
        style={styles.map} 
        region={mapRegion}
        provider={PROVIDER_GOOGLE}
      > 
        <Marker 
            coordinate={mapRegion} 
            title="You're Here" 
        >
          <MaterialIcons name='location-history' size={45}  color={brand} />
        </Marker>
      </MapView>}

      { isLocationChecking && <StyledContainer>
        <DashboardContainer>
          <ActivityIndicator size="large" color="#000"/>
          <ButtonText mapLoading={true}>Fetching your location...</ButtonText>
        </DashboardContainer>
      </StyledContainer>}

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