import React, { useState, useEffect } from 'react'
import { ImageBackground, ActivityIndicator } from "react-native"
import { StatusBar } from 'expo-status-bar'

import { 
    Colors, StyledContainer, InnerContainer, PageTitle, StyledFormArea,  StyledButton, ButtonText, PageLogo, DashboardContainer, Avatar, BottomNav } from '../components/styles'

import KeyboardingAvoidWrapper from '../components/KeyboardingAvoidWrapper'

const { primary, brand, darkLight } = Colors;

const AdminDashboardScreen = ({navigation}) => {
    

    useEffect(() => {
        
    }, [])


  return (
    <StyledContainer dashbaord={true}>
        <ImageBackground source={require('./../assets/bg.png')} resizeMode="cover" style={{ flex:1, justifyContent:'center'}}>
            <StatusBar style='dark' />
            {/* <Avatar resizeMode="contain" source={require('./../assets/logo.png')}/> */}
           <InnerContainer>
                <DashboardContainer>
                <BottomNav />
                </DashboardContainer>
            </InnerContainer>
        </ImageBackground>
    </StyledContainer>
  )
};


export default AdminDashboardScreen
