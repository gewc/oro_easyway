import React, { useEffect, useState } from 'react';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import { StyleSheet, View, ActivityIndicator, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar'
import * as Location from 'expo-location';
import { Direction_API } from '../config';

import Constants from "expo-constants";
import { decode } from "@googlemaps/polyline-codec";

const StatusBarHeight = Constants.statusBarHeight;

import { Colors, ButtonText, ExtraText, StyledContainer, DashboardContainer, LeftIcon, StyledButton } from '../components/styles'
import {MaterialIcons, Entypo, Ionicons  } from '@expo/vector-icons' 

import axios from 'axios'
axios.defaults.baseURL = 'https://oro-easyway.onrender.com/api/v1';
// axios.defaults.baseURL = 'http://192.168.134.148:8080/api/v1';

const { primary, brand, darkLight, red } = Colors;

export default function MaterialSearchMapScreen({navigation, route}) {
    const {searchText} = route.params
    const [mapRegion, setMapRegion] = useState({
        latitude: 8.477217,
        longitude: 124.645920,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
    });
    const [mlocation, setLocation] = useState(null);
    const [isLocationChecking, setIsLocationChecking] = useState(true);
    const [storeData, setStoreData] = useState(null);
    const [storeDetails, setStoreDetails] = useState(null);
    const [coordsPolyline, setCoordsPolyline] = useState([]);
    const [polylineVisible, setPolylineVisible] = useState(false);

    const userLocation = async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if(status !== 'granted'){
            setErrorMsg('Permission to access location was denied.');
        }
        let mylocation = await Location.getCurrentPositionAsync({enableHighAccuracy: true});
        setMapRegion({
            latitude: mylocation.coords.latitude,
            longitude: mylocation.coords.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
        });
        setLocation(mylocation);
        
    }

    const getHardwareStore = async () => {
      await axios.get('/products/materialsearch/'+searchText)
        .then((response) => {
            const result = response.data;
            const { message, status, data } = result;
            console.log('Material Search Data',result)

            if(status !== "SUCCESS"){ // IF ERROR FROM SERVER
                // handleMessage(message, status)
            } else {
                // handleMessage(message, status)
                setStoreData(data)
                console.log('storeData', storeData)
            }
            setIsLocationChecking(false);
        })
        .catch( error => {
            console.log(error.message)
            setIsLocationChecking(false);
            // handleMessage("An error occured. Check your network and try again!")
        });
    }

    const handleStorePress = async (value, mapRegion) => {
      let startLoc = `${mapRegion.latitude},${mapRegion.longitude}`
      let storeLoc = JSON.parse(value.location)
      let endLoc = `${storeLoc.latitude},${storeLoc.longitude}`

      let resp = await fetch(`https://maps.googleapis.com/maps/api/directions/json?origin=${startLoc}&destination=${endLoc}&mode=WALKING&key=${Direction_API}`)

      let respJson = await resp.json();
      let distance = respJson.routes[0].legs[0].distance;
      let duration = respJson.routes[0].legs[0].duration;
      let points = decode(respJson.routes[0].overview_polyline.points, 5);
      let coords = points.map((point, index) => {
          return  {
              latitude : point[0],
              longitude : point[1]
          }
      })

      // console.log(coords)
      setCoordsPolyline(coords)
      setPolylineVisible(true)
      

      setStoreDetails({...value, distance, duration})
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
            key='-1'
            title= "You're Here"
        >
          <MaterialIcons name='location-history' size={35}  color={brand} />
        </Marker>

        {storeData.map((v, k) =>{
          return (
            <Marker 
            coordinate={JSON.parse(v.location)}
            key={k}
            title={v.name}
            onPress={() => handleStorePress(v, mapRegion)}

            >
              <MyMarker />
            </Marker>
          )
        })
        }

        { polylineVisible && <Polyline coordinates={coordsPolyline} strokeColor='red' strokeWidth={3}/>}

      </MapView>
      }

      { isLocationChecking && <StyledContainer>
        <DashboardContainer>
          <ActivityIndicator size="large" color="#000"/>
          <ButtonText mapLoading={true}>Fetching your location.</ButtonText>
        </DashboardContainer>
      </StyledContainer>}

      { (!isLocationChecking && storeDetails !== null) && 
        <MyStoreDetails 
          name={storeDetails.name} 
          address={storeDetails.address} 
          contact={storeDetails.contact}
          distance={storeDetails?.distance?.text}
          duration={storeDetails?.duration?.text}
        /> }

    </View>
  );
}

const MyMarker = ({ name, ...props}) =>{
  return(
      <View >
          <Entypo  tisto name='shop' size={25}  color='#276221' />
      </View>
  )
}

const MyStoreDetails = ({ name, address, contact, distance, duration,  ...props}) =>{
  return(
      <View style={styles.storeDetails}>
          <View style={{width: '75%'}}>
            <ExtraText storeName={true} adjustsFontSizeToFit={true} numberOfLines={1}>{name.toUpperCase()}</ExtraText>
            <ExtraText storeAddress={true} adjustsFontSizeToFit={true} numberOfLines={1}>{address}</ExtraText>
            <View style={styles.distance}>

              <View style={{
                flexDirection: 'row',
              }}>
                <LeftIcon distance={true} >
                  <Ionicons name='car' size={28}  color={brand} />
                </LeftIcon>
                <ExtraText distance={true}>{distance}</ExtraText>
              </View>
              <View style={{
                flexDirection: 'row',
              }}>
                <LeftIcon distance={true} >
                  <Ionicons name='time' size={28}  color={brand} />
                </LeftIcon>
                <ExtraText distance={true} >{duration}</ExtraText>
              </View>
            </View>
          </View>
          <View>
            <StyledButton viewStore={true}>
              <ButtonText>View</ButtonText>
            </StyledButton>
          </View>
      </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  storeDetails: {
    justifyContent: 'center',
    alignSelf: 'center',
    width: '90%',
    height: 100,
    position:'absolute',
    top: StatusBarHeight + 50,
    backgroundColor: '#fff',
    elevation: 5,
    borderRadius: 5,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  distance:{
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginTop: 5,
  }
});