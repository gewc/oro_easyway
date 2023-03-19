import React, { useState, useEffect } from 'react'
import { ImageBackground } from "react-native"
import { StatusBar } from 'expo-status-bar'

import { 
    Colors, StyledContainer, InnerContainer, PageTitle, StyledFormArea,  StyledButton, ButtonText, PageLogo, DashboardContainer, Avatar } from '../components/styles'

import KeyboardingAvoidWrapper from '../components/KeyboardingAvoidWrapper'

const { primary, brand, darkLight } = Colors;

const DashboardScreen = ({navigation}) => {
    const [hidePassword, setHidePassword] = useState(true);

    const acctTypes = [
        { label: 'Admin', value: 'Admin' },
        { label: 'Store Owner', value: 'Store Owner' },
        { label: 'Staff', value: 'Staff' },
        { label: 'Client', value: 'Client' },
    ]

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
                            borderColor: "white"
                        }}
                    />
                    <PageTitle dashbaord={true}>ORO - EASY WAY</PageTitle>
                    <StyledFormArea>
                        <StyledButton findMaterial={true} onPress={() => {navigation.navigate('MaterialSearch')}}>
                            <ButtonText findMaterial={true}>Materials</ButtonText>
                        </StyledButton>
                        <StyledButton findMaterial={true} onPress={() => {navigation.navigate('StoreSearch')}}>
                            <ButtonText findMaterial={true}>Hardware Stores</ButtonText>
                        </StyledButton>
                    </StyledFormArea>
                </DashboardContainer>
            </InnerContainer>
        </ImageBackground>
    </StyledContainer>
  )
};


export default DashboardScreen
