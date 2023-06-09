import React, { useState, useEffect } from 'react'
import { ImageBackground, View, Alert, BackHandler } from "react-native"
import { StatusBar } from 'expo-status-bar'

import { Octicons } from '@expo/vector-icons'

import { Colors, StyledContainer, InnerContainer, PageTitle, StyledFormArea,  LeftIcon, DashboardContainer,  PageLogo, StyledTextInput, StyledButton, ButtonText } from '../components/styles'

import KeyboardingAvoidWrapper from '../components/KeyboardingAvoidWrapper'

const { primary, brand, darkLight } = Colors;

const MaterialSearch = ({navigation, route}) => {
    const { mapRegion } = route.params
    const [searchText, setSearchText] = useState('')

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
                            borderColor: "white"
                        }}
                    />
                    <PageTitle dashbaord={true}>Do you want to find a materials?</PageTitle>
                    <StyledFormArea>
                        <MyTextInput
                            searchMaterial={true}
                            icon="search" 
                            placeholder="Search"
                            onChangeText={text => setSearchText(text)}
                        />
                        <StyledButton btnSearch={true} onPress={() => {navigation.navigate('MaterialSearchStoreListScreen', {searchText, mapRegion, type: 'material'})}}>
                            <ButtonText>Search</ButtonText>
                        </StyledButton>
                    </StyledFormArea>
                </DashboardContainer>
            </InnerContainer>
        </ImageBackground>
    </StyledContainer>
  )
};

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

export default MaterialSearch
