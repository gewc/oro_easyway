import React, { useState, useEffect } from 'react'
import { StyleSheet, View, ActivityIndicator } from "react-native"
import { StatusBar } from 'expo-status-bar'
import MapView, { Marker } from 'react-native-maps';
import { Formik } from 'formik'
import AsyncStorage from '@react-native-async-storage/async-storage';

import Constants from "expo-constants";

const StatusBarHeight = Constants.statusBarHeight;

import {Octicons } from '@expo/vector-icons' 

import { 
    Colors, StyledContainer, InnerContainer, PageTitle, StyledFormArea,  LeftIcon, MsgBox,  StyledInputLabel, StyledTextInput, StyledButton, ButtonText } from '../components/styles'

import axios from 'axios'
axios.defaults.baseURL = 'https://oro-easyway.onrender.com/api/v1';

const { primary, brand, darkLight } = Colors;


const StoreSearchProfileScreen = ({navigation, route}) => {
    const [message, setMessage] = useState();
    const [messageType, setMessageType] = useState();
    const [storeData, setStoreData] = useState();
    const {name} = route.params
    const location = JSON.parse(data.location)
    
    const [mapRegion, setMapRegion] = useState({
        latitude: location.latitude,
        longitude: location.longitude,
        latitudeDelta: 0.0098,
        longitudeDelta: 0.0098,
    });

    const getStoreDetails = async () => {
        console.log(name)
        handleMessage("Loading...", "Default")
        await axios.get(`/stores/search/${name}`)
            .then((response) => {
                const result = response.data;
                const { message, status, data } = result;
                console.log("Get Products Result", data)


                if(status !== "SUCCESS"){
                    handleMessage(message, status)
                } else {
                    if(data.length < 1){
                        setProductData(data)
                        setOldProductData(data)
                        handleMessage("There is no product's yet.")
                    }else{
                        setProductData(data)
                        setOldProductData(data)
                        handleMessage("")
                    }
                    
                }
            })
            .catch( error => {
                console.log(error.message)
                handleMessage("An error occured. Check your network and try again!")
            });
    }
    

    const handleMessage = (message, type = 'FAILED') => {
        setMessage(message);
        setMessageType(type);
    }

  

  return (
    <StyledContainer dashbaord={true}>
        <StatusBar style='dark' />
        {/* <Avatar resizeMode="contain" source={require('./../assets/logo.png')}/> */}
        <InnerContainer>
            <PageTitle>Store Profile</PageTitle>
            <MapView style={styles.map} region={mapRegion}> 
                <Marker 
                    draggable 
                    coordinate={mapRegion} 
                    title={storeData.name}
                />
            </MapView>
            
            <Formik
                initialValues={ storeData || {name: '', location: '', website: '', address: '', contact: '', email: ''}}
                enableReinitialize
            >
                {({values}) =>

                <StyledFormArea>
                    <MyTextInput 
                        storeProfile={true}
                        label = "Store Name"
                        value={values.name}
                    />
                    <MyTextInput 
                        storeProfile={true}
                        label = "Address"
                        value={values.address}
                    />
                    <MyTextInput 
                        storeProfile={true}
                        label = "Contact No."
                        value={values.contact}
                    />
                    <MyTextInput 
                        storeProfile={true}
                        label = "Email Address"
                        value={values.email}
                    />
                    <MyTextInput 
                        storeProfile={true}
                        label = "Website"
                        value={values.website}
                    />

                    <MsgBox type={messageType}>{message}</MsgBox>

                    <StyledButton  onPress={()=>{}}>
                        <ButtonText findMaterial={true}>View Products</ButtonText>
                    </StyledButton>

                </StyledFormArea>

            }
                                    
            </Formik>
                
        </InnerContainer>
    </StyledContainer>
  )
}

const MyTextInput = ({ label, icon,  ...props}) =>{
    return(
        <View>
            <StyledInputLabel {...props} >{label}</StyledInputLabel>
            <LeftIcon >
                <Octicons name={icon} size={30}  color={brand} />
            </LeftIcon>
            <StyledTextInput {...props} />
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    map: {
      width: '100%',
      height: '30%',
      bottom: 10,
      top: 1,
      
    },
  });

export default StoreSearchProfileScreen
