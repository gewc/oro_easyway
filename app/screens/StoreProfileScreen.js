import React, { useState, useEffect } from 'react'
import { StyleSheet, View, ActivityIndicator } from "react-native"
import { StatusBar } from 'expo-status-bar'
import MapView, { Marker } from 'react-native-maps';
import { Formik } from 'formik'

import Constants from "expo-constants";

const StatusBarHeight = Constants.statusBarHeight;

import {Octicons } from '@expo/vector-icons' 

import { 
    Colors, StyledContainer, InnerContainer, PageTitle, StyledFormArea,  LeftIcon, DashboardContainer,  StyledInputLabel, StyledTextInput, StyledButton, ButtonText } from '../components/styles'



const { primary, brand, darkLight } = Colors;

const StoreProfileScreen = ({navigation, route}) => {
    const {data} = route.params
    const location = JSON.parse(data.location)
    console.log("Store Profile", location)
    const [mapRegion, setMapRegion] = useState({
        latitude: location.latitude,
        longitude: location.longitude,
        latitudeDelta: 0.0098,
        longitudeDelta: 0.0098,
    });

    const [mlocation, setLocation] = useState();

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
            
            <Formik
                initialValues={ data || {name: '', location: JSON.stringify(mlocation) || data.location, website: '', address: '', contact: '', email: ''}}
                enableReinitialize
                onSubmit={(values,{setSubmitting, resetForm}) => {
                    console.log(values);
                    
                }}
            >
                {({handleChange, handleBlur, handleSubmit, values, isSubmitting}) =>

                <StyledFormArea>
                    <MyTextInput 
                        storeProfile={true}
                        label = "Store Name"
                        onChangeText={handleChange('name')}
                        value={values.name}
                    />
                    <MyTextInput 
                        storeProfile={true}
                        label = "Address"
                        onChangeText={handleChange('address')}
                        value={values.address}
                    />
                    <MyTextInput 
                        storeProfile={true}
                        label = "Contact No."
                        onChangeText={handleChange('contact')}
                        value={values.contact}
                    />
                    <MyTextInput 
                        storeProfile={true}
                        label = "Email Address"
                        onChangeText={handleChange('email')}
                        value={values.email}
                    />
                    <MyTextInput 
                        storeProfile={true}
                        label = "Website"
                        onChangeText={handleChange('website')}
                        value={values.website}
                    />

                    
                    { !isSubmitting && <StyledButton  onPress={handleSubmit}>
                        <ButtonText findMaterial={true}>Update</ButtonText>
                    </StyledButton>}
                    { isSubmitting && <StyledButton  disabled={true}>
                        <ActivityIndicator size="large" color={primary}/>
                    </StyledButton> }

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
      top: 1
    },
  });

export default StoreProfileScreen
