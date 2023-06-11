import React, { useEffect, useState } from 'react';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import { StyleSheet, View, ActivityIndicator, Image } from 'react-native';
import * as Device from 'expo-device';
import Hyperlink from 'react-native-hyperlink';
import * as Location from 'expo-location';


import Constants from "expo-constants";
import { decode } from "@googlemaps/polyline-codec";

const StatusBarHeight = Constants.statusBarHeight;

import { Colors, ButtonText, ExtraText, StyledContainer, DashboardContainer, LeftIcon, StyledButton } from '../components/styles'
import {MaterialIcons, Entypo, Ionicons  } from '@expo/vector-icons' 

import axios from 'axios'
// axios.defaults.baseURL = 'https://oro-easyway.onrender.com/api/v1';
// axios.defaults.baseURL = 'http://192.168.254.147:8080/api/v1';

const { primary, brand, darkLight, red } = Colors;

export default function MaterialSearchMapScreen({navigation, route}) {
    const {searchText, mapRegion, type, sData} = route.params
    
    
    const [isLocationChecking, setIsLocationChecking] = useState(true);
    const [storeData, setStoreData] = useState(null);
    const [storeDetails, setStoreDetails] = useState(null);
    const [coordsPolyline, setCoordsPolyline] = useState([]);
    const [polylineVisible, setPolylineVisible] = useState(false);
    

    const getHardwareStoreByMaterial = async () => {
      await axios.get('/products/materialsearch/'+searchText)
        .then((response) => {
            const result = response.data;
            const { message, status, data } = result;
            console.log('Material Search Data',result)

            if(status !== "SUCCESS"){ // IF ERROR FROM SERVER
                // handleMessage(message, status)
                console.log(status, message)
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

    const getHardwareStore = async () => {
      await axios.get('/stores/search/'+searchText)
        .then((response) => {
            const result = response.data;
            const { message, status, data } = result;
            console.log('Store Search Data',result)

            if(status !== "SUCCESS"){ // IF ERROR FROM SERVER
                // handleMessage(message, status)
                console.log(status, message)
            } else {
                // handleMessage(message, status)
                handleStorePress(data[0], mapRegion)
                setStoreData(data)
                // console.log('storeData', storeData)
            }
            setIsLocationChecking(false);
        })
        .catch( error => {
            console.log(error.message)
            setIsLocationChecking(false);
            // handleMessage("An error occured. Check your network and try again!")
        });
    }

    const handleViewPress = async (storeId, name, mapRegion) => {
      const deviceId = Device.osInternalBuildId
      const {longitude, latitude} = mapRegion
      let address = await Location.reverseGeocodeAsync({
        longitude,
        latitude,
      });

      await axios.post('http://192.168.157.147:8080/api/v1/views/',{storeId, deviceId, address})
        .then((response) => {
            const result = response.data;
            const { message, status, data } = result;
            console.log('View Store Data',result)
            
        })
        .catch( error => {
            console.log('View Store Data',error.message)
        });

      navigation.navigate('StoreViewerScreen', {_id: storeId, storeName: name})

    }

    const handleStorePress = async (value, mapRegion) => {
      let startLoc = `${mapRegion.latitude},${mapRegion.longitude}`
      let storeLoc = JSON.parse(value.location)
      let endLoc = `${storeLoc.latitude},${storeLoc.longitude}`
      const dpi = "AIzaSyA_3q3QEmAQg5i4wuM1jrBiKm0S1_FKASE"

      let resp = await fetch(`https://maps.googleapis.com/maps/api/directions/json?origin=${startLoc}&destination=${endLoc}&mode=WALKING&key=${dpi}`)

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
      if(type == 'store'){
        getHardwareStore();
      }else{
        handleStorePress(sData, mapRegion)
        setIsLocationChecking(false);
      }
        
    }, [])

  return (
    <View style={styles.container}>

      { !isLocationChecking && <MapView 
        style={styles.map} 
        region={mapRegion}
        provider={PROVIDER_GOOGLE}
      > 
       

        {storeData !== null && type == 'store' && storeData.map((v, k) =>{
          return (
            <Marker 
            coordinate={JSON.parse(v.location)}
            key={k}
            title={v.name.toUpperCase()}
            // onPress={() => handleStorePress(v, mapRegion)}

            >
              <MyMarker />
            </Marker>
          )
        })
        }

        {type == 'material' && 
            <Marker 
            coordinate={JSON.parse(sData.location)}
            key='0'
            title={sData.name.toUpperCase()}

            >
              <MyMarker />
            </Marker>
        }

        <Marker 
            coordinate={mapRegion} 
            key='-1'
            title= "You're Here"
        >
          {/* <MaterialIcons name='location-history' size={35}  color={brand} /> */}
          <Image source={require('./../assets/loc.png')} style={{height: 35, width:35}} />
        </Marker>

        { polylineVisible && <Polyline coordinates={coordsPolyline} strokeColor='red' strokeWidth={2}/>}

      </MapView>
      }

      { isLocationChecking && <StyledContainer>
        <DashboardContainer>
          <ActivityIndicator size="large" color="#000"/>
          <ButtonText mapLoading={true}>Finding hardware store's.</ButtonText>
        </DashboardContainer>
      </StyledContainer>}

      { (!isLocationChecking && storeDetails !== null) && 
        <MyStoreDetails 
          id={storeDetails._id}
          name={storeDetails.name} 
          address={storeDetails.address} 
          contact={storeDetails.contact}
          website={storeDetails.website}
          distance={storeDetails?.distance?.text}
          duration={storeDetails?.duration?.text}
          navigation={navigation}
          handleViewPress={handleViewPress}
          mapRegion={mapRegion}
        /> }

    </View>
  );
}

const MyMarker = ({ name, ...props}) =>{
  return(
      <View >
          {/* <Entypo  tisto name='shop' size={25}  color={red} elevation={1} /> */}
          <Image source={require('./../assets/storeLoc.png')} style={{height: 25, width:25}} />
      </View>
  )
}

const MyStoreDetails = ({ id, name, address, contact, website, distance, duration, navigation, handleViewPress, mapRegion, ...props}) =>{
  return(
      <View style={styles.storeDetails}>
          <View style={{width: '75%'}}>
            <ExtraText storeName={true} adjustsFontSizeToFit={true} numberOfLines={1}>{name.toUpperCase()}</ExtraText>
            
            <View style={{
              flexDirection: 'row',
            }}>
              <LeftIcon distance={true} >
                <Ionicons name='home' size={16}  color={brand} />
              </LeftIcon>
              <ExtraText storeAddress={true} adjustsFontSizeToFit={true} numberOfLines={1}>{address}</ExtraText>
            </View>
            <View style={{
              flexDirection: 'row',
            }}>
              <LeftIcon distance={true} >
                <Entypo name='phone' size={16}  color={brand} />
              </LeftIcon>
              <ExtraText storeAddress={true} adjustsFontSizeToFit={true} numberOfLines={1}>{contact}</ExtraText>
            </View>
            <View style={{
              flexDirection: 'row',
            }}>
              <LeftIcon distance={true} >
                <Ionicons name='globe' size={16}  color={brand} />
              </LeftIcon>
              <Hyperlink linkDefault={true}>
                <ExtraText storeAddress={true} adjustsFontSizeToFit={true} numberOfLines={1}>{website}</ExtraText>
              </Hyperlink>
              
            </View>
            
            
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
            <StyledButton viewStore={true} onPress={() => {handleViewPress(id, name, mapRegion)}}>
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
    height: 140,
    position:'absolute',
    top: StatusBarHeight + 50,
    backgroundColor: '#fff',
    elevation: 5,
    borderRadius: 10,
    borderColor: "#515460",
    borderWidth: 1,
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