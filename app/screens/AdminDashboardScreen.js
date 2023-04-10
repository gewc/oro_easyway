import React, { useState, useEffect } from 'react'
import { ImageBackground, ActivityIndicator, BackHandler, Alert } from "react-native"
import { StatusBar } from 'expo-status-bar'
import {MaterialIcons, Entypo, Ionicons  } from '@expo/vector-icons' 
import { useRoute } from '@react-navigation/native';

import { 
    Colors, StyledContainer, InnerContainer, PageTitle, StyledFormArea,  StyledButton, ButtonText, PageLogo, DashboardContainer, Avatar, LeftIcon } from '../components/styles'


const { primary, brand, darkLight } = Colors;

const AdminDashboardScreen = ({navigation, route}) => {
    const {data} = route.params;
    console.log(data);

    const screen = useRoute();
    useEffect(() => {
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
           <InnerContainer>
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
                        }}
                    />
                    <PageTitle dashbaord={true}>Admin Dashboard</PageTitle>
                    <StyledFormArea>
                        <StyledButton adminDash={true} onPress={() => {navigation.navigate('RegistrationListScreen', {data})}}>
                            <MaterialIcons name="app-registration" size={25}  color={primary} /> 
                            <ButtonText adminDash={true}> 
                                Registrations
                            </ButtonText>
                        </StyledButton>
                        <StyledButton adminDash={true} onPress={() => {navigation.navigate('AdminStoreListScreen', {data})}}>
                            <MaterialIcons name="hardware" size={25}  color={primary} /> 
                            <ButtonText adminDash={true}>Hardware Stores</ButtonText>
                        </StyledButton>
                        <StyledButton adminDash={true} onPress={() => {navigation.navigate('')}}>
                            <MaterialIcons name="person" size={25}  color={primary} /> 
                            <ButtonText adminDash={true}>My Profile</ButtonText>
                        </StyledButton>
                    </StyledFormArea>
                </DashboardContainer>
            </InnerContainer>
        </ImageBackground>
    </StyledContainer>
  )
};


export default AdminDashboardScreen
