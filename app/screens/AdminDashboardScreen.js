import React, { useState, useEffect } from 'react'
import { ImageBackground, ActivityIndicator, BackHandler, Alert } from "react-native"
import { StatusBar } from 'expo-status-bar'
import {MaterialIcons, Entypo, Ionicons  } from '@expo/vector-icons'

import { 
    Colors, StyledContainer, InnerContainer, PageTitle, StyledFormArea,  StyledButton, ButtonText, PageLogo, DashboardContainer, NotifiText, UserText, Avatar, LeftIcon } from '../components/styles'

import axios from 'axios'
axios.defaults.baseURL = 'https://oro-easyway.onrender.com/api/v1';
// axios.defaults.baseURL = 'http://192.168.254.148:8080/api/v1';

const { primary, brand, darkLight } = Colors;

const AdminDashboardScreen = ({navigation, route}) => {
    const {data} = route.params;
    const [countPedning, setCountPending] = useState(0);
    console.log("User data", data)

    const getRegistersCount = async () => {
        await axios.get(`/registers`)
            .then((response) => {
                const result = response.data;
                const { message, status, data } = result;
                //console.log("Get Registers Result", data)

                if(status !== "SUCCESS"){
                    console.log(message)
                } else {
                    if(data.length >= 1){
                        let pending = []
                        data.map((v, k) => {
                            if(v.status == "Pending"){
                                pending.push(v)
                            }
                        })
                        setCountPending(pending.length);

                    }
                    
                }
            })
            .catch( error => {
                console.log('Get All Register Error: ',error.message)
                console.log(error.message)
            });
    }

    useEffect(() => {
        if(navigation.isFocused()){
            getRegistersCount()
        }
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
                    { data?.result.name && <UserText>{data?.result.name.toUpperCase()}</UserText>}
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
                                Store Registrations
                            </ButtonText>
                            {countPedning > 0 && <NotifiText>{countPedning}</NotifiText>}
                        </StyledButton>
                        <StyledButton adminDash={true} onPress={() => {navigation.navigate('AdminStoreListScreen', {data})}}>
                            <MaterialIcons name="hardware" size={25}  color={primary} /> 
                            <ButtonText adminDash={true}>Hardware Stores</ButtonText>
                        </StyledButton>
                        {/* <StyledButton adminDash={true} onPress={() => {navigation.navigate('AdminProfileScreen', {userData: data})}}>
                            <MaterialIcons name="groups" size={25}  color={primary} /> 
                            <ButtonText adminDash={true}>Users</ButtonText>
                        </StyledButton> */}
                        <StyledButton adminDash={true} onPress={() => {navigation.navigate('AdminProfileScreen', {userData: data})}}>
                            <MaterialIcons name="person" size={25}  color={primary} /> 
                            <ButtonText adminDash={true}>My Profile</ButtonText>
                        </StyledButton>
                        <StyledButton adminDash={true} onPress={() => {navigation.navigate('Register', {userData: data})}}>
                            <MaterialIcons name="person-add" size={25}  color={primary} /> 
                            <ButtonText adminDash={true}>Add New User</ButtonText>
                        </StyledButton>
                    </StyledFormArea>
                </DashboardContainer>
            </InnerContainer>
        </ImageBackground>
    </StyledContainer>
  )
};


export default AdminDashboardScreen
