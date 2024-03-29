import React, { useState, useEffect } from 'react'
import { ImageBackground, ActivityIndicator, Alert, BackHandler } from "react-native"
import { StatusBar } from 'expo-status-bar'
import * as Location from 'expo-location';
import { StackActions } from '@react-navigation/native';

import { 
    Colors, StyledContainer, InnerContainer, PageTitle, StyledFormArea,  StyledButton, ButtonText, PageLogo, DashboardContainer, Avatar } from '../components/styles'

import KeyboardingAvoidWrapper from '../components/KeyboardingAvoidWrapper'

const { primary, brand, darkLight } = Colors;

const DashboardScreen = ({navigation}) => {
    const [mapRegion, setMapRegion] = useState({
        latitude: 8.477217,
        longitude: 124.645920,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
    });
    const [isLocationChecking, setIsLocationChecking] = useState(true);

    const userLocation = async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if(status !== 'granted'){
            setErrorMsg('Permission to access location was denied.');
        }
        let mylocation = await Location.getCurrentPositionAsync({});
        let mapR = {
            latitude: mylocation.coords.latitude,
            longitude: mylocation.coords.longitude,
            // latitudeDelta: 0.0922,
            // longitudeDelta: 0.0421,
            latitudeDelta: 0.1222,
            longitudeDelta: 0.1221,
        }

        setMapRegion({
            latitude: mylocation.coords.latitude,
            longitude: mylocation.coords.longitude,
            // latitudeDelta: 0.0922,
            // longitudeDelta: 0.0421,
            latitudeDelta: 0.1222,
            longitudeDelta: 0.1221,
        });

        setIsLocationChecking(false);
        // navigation.navigate('MaterialSearch', {mapRegion})
        navigation.dispatch(
            StackActions.replace('MaterialSearch', {mapRegion: mapR})
          );
    }

    useEffect(() => {
        userLocation();
        const backAction = () => {
            
            if(navigation.isFocused()){
                Alert.alert("Log out!", "Are you sure want to exit the app?", [
                    {
                        text: "Cancel",
                        onPress: () => null,
                        style: "cancel"
                    },
                    {
                        text: "Yes",
                        onPress: () => BackHandler.exitApp(),
                    },
                ])
                return true;
            }
        }
        const backButton = BackHandler.addEventListener(
            "hardwareBackPress",
            backAction
        )

        return () => backButton.remove()
    }, [])


  return (
    <StyledContainer dashbaord={true}>
        <ImageBackground source={require('./../assets/bg.png')} resizeMode="cover" style={{ flex:1, justifyContent:'center'}}>
            <StatusBar style='dark' />
            {/* <Avatar resizeMode="contain" source={require('./../assets/logo.png')}/> */}
            { isLocationChecking && <InnerContainer>
                <DashboardContainer>
                    <PageLogo 
                        resizeMode="contain" 
                        overflow={1} 
                        source={require('./../assets/logo.png')}
                        style={{
                            width: 100,
                            height: 100,
                            borderWidth: 2,
                            borderColor: "white",
                            marginBottom: 30
                        }}
                    />
                    <ActivityIndicator size="large" color="#fff" style={{ marginBottom: 20}}/>
                    <ButtonText dashboard={true}>Fetching your location.</ButtonText>
                </DashboardContainer>
            </InnerContainer>}

            { !isLocationChecking &&<InnerContainer>
                <DashboardContainer>
                    <PageLogo 
                        resizeMode="contain" 
                        overflow={1} 
                        source={require('./../assets/logo.png')}
                        style={{
                            width: 100,
                            height: 100,
                            borderWidth: 2,
                            borderColor: "white"
                        }}
                    />
                    <PageTitle dashbaord={true}>ORO - EASY WAY</PageTitle>
                    <StyledFormArea>
                        <StyledButton findMaterial={true} onPress={() => {navigation.navigate('MaterialSearch', {mapRegion})}}>
                            <ButtonText findMaterial={true}>Materials</ButtonText>
                        </StyledButton>
                        <StyledButton findMaterial={true} onPress={() => {navigation.navigate('StoreSearch', {mapRegion})}}>
                            <ButtonText findMaterial={true}>Hardware Stores</ButtonText>
                        </StyledButton>
                    </StyledFormArea>
                </DashboardContainer>
            </InnerContainer>}
        </ImageBackground>
    </StyledContainer>
  )
};


export default DashboardScreen
