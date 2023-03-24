import React, { useState, useEffect } from 'react'
import { ImageBackground, View } from "react-native"
import { StatusBar } from 'expo-status-bar'
import AsyncStorage from '@react-native-async-storage/async-storage';

import { Octicons } from '@expo/vector-icons'

import { 
    Colors, StyledContainer, InnerContainer, PageTitle, StyledFormArea,  LeftIcon, DashboardContainer,  PageLogo, StyledTextInput, StyledButton, ButtonText } from '../components/styles'



const { primary, brand, darkLight } = Colors;

const StoreMenuScreen = ({navigation, route}) => {
    const { storeName, data } = route.params;
    const [storeProfile, setStoreProfile] = useState(null);
    const [ustoreName, setUstoreName] = useState(storeName);

    const getObjectData = async (key, setData) => {
        try {
          const jsonValue = await AsyncStorage.getItem(key);
          jsonValue != null ? setData(JSON.parse(jsonValue)) : null;
        } catch(e) {
            console.log(e.message)
        }
    }

    useEffect(() => {
        getObjectData('@storeProfile',setStoreProfile);
        console.log('Store Menu',storeProfile);
        setUstoreName(storeProfile.name)
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
                            borderRadius: 50
                        }}
                    />
                    <PageTitle dashbaord={true}>{ ustoreName.toUpperCase() }</PageTitle>
                    <StyledFormArea>
                        <StyledButton findMaterial={true} onPress={() => {navigation.navigate('StoreProfileScreen', {storeName, data})}}>
                            <ButtonText findMaterial={true}>Store Profile</ButtonText>
                        </StyledButton>
                        <StyledButton findMaterial={true} onPress={() => {navigation.navigate('StoreProductListScreen',  {storeName, data})}}>
                            <ButtonText findMaterial={true}>Product's List</ButtonText>
                        </StyledButton>
                    </StyledFormArea>
                </DashboardContainer>
            </InnerContainer>
        </ImageBackground>
    </StyledContainer>
  )
}

const MyTextInput = ({ label, icon,  ...props}) =>{
    return(
        <View>
            <LeftIcon >
                <Octicons name={icon} size={30}  color={brand} />
            </LeftIcon>
            <StyledTextInput {...props} />
        </View>
    )
}

export default StoreMenuScreen
