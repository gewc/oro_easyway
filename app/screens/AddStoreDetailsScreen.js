import React, { useState, useEffect } from 'react'
import { ImageBackground, View, ActivityIndicator } from "react-native"
import { StatusBar } from 'expo-status-bar'
import { Formik } from 'formik'
import AsyncStorage from '@react-native-async-storage/async-storage';

import { 
    Colors, StyledContainer, InnerContainer, PageTitle, StyledFormArea, MsgBox, StyledButton, ButtonText, PageLogo, DashboardContainer, SubTitle, StyledTextInput, StyledInputLabel, ExtraView, TextLink, TextLinkContent, ExtraText } from '../components/styles'

import axios from 'axios'
axios.defaults.baseURL = 'https://oro-easyway.onrender.com/api/v1';

const { primary, brand, darkLight } = Colors;

const AddStoreDetailsScreen = ({navigation, route}) => {
    const [message, setMessage] = useState();
    const [messageType, setMessageType] = useState();
    const {storeName, locDetails, location} = route.params;
    //console.log(route.params)

    const acctTypes = [
        { label: 'Admin', value: 'Admin' },
        { label: 'Store Owner', value: 'Store Owner' },
        { label: 'Staff', value: 'Staff' },
        { label: 'Client', value: 'Client' },
    ]

    const handleStoreDetails = async (data, setSubmitting) => {
        handleMessage(null)
        await axios.post('/stores',data)
            .then((response) => {
                const result = response.data;
                const { message, status, data } = result;
                const {name} = data;

                if(status !== "SUCCESS"){
                    handleMessage(message, status)
                } else {
                    handleMessage(message, status)
                    mergeOjectData('@store',{status: 'Main Menu'})
                    storeOjectData('@storeProfile', data)
                    navigation.navigate('StoreMenuScreen', {storeName: name, data: data})
                }
                setSubmitting(false)
            })
            .catch( error => {
                console.log(error.message)
                setSubmitting(false)
                handleMessage("An error occured. Check your network and try again!")
            });
    }

    const storeOjectData = async (key, value) => {
        try {
            const jsonValue = JSON.stringify(value)
            await AsyncStorage.setItem(key, jsonValue)
        } catch (e) {
            console.log(e.message)
        }
    }

    const mergeOjectData = async (key, value) => {
        try {
            const jsonValue = JSON.stringify(value)
            await AsyncStorage.mergeItem(key, jsonValue)
        } catch (e) {
            console.log(e.message)
        }
    }

    const handleMessage = (message, type = 'FAILED') => {
        setMessage(message);
        setMessageType(type);
    }

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
                            width: 120,
                            height: 120,
                            borderWidth: 2,
                            borderColor: "white",
                        }}
                    />
                    <PageTitle dashbaord={true}>{storeName.toUpperCase()}</PageTitle>
                    <SubTitle storeDetails={true}>Store Details</SubTitle>
                    <MsgBox type={messageType}>{message}</MsgBox>
                    <Formik
                        initialValues={{ address: '', contact: '', email: '', website: ''}}
                        onSubmit={(values, {setSubmitting}) => {
                            const data = {...values, storeName, location: JSON.stringify(location)}
                            console.log(data);
                            if(data.address == '' || data.contact == '' || data.email == '' || data.website == '' || data.storeName == '' || data.location == ''){
                                handleMessage(`Please don't leave a blank!`)
                                setSubmitting(false)
                            }else if(Object.keys(location).length < 2){
                                handleMessage(`Please select you store location!`)
                                setSubmitting(false)
                            }else{
                                handleStoreDetails(data, setSubmitting)
                            }
                            
                        }}
                    >
                        {({handleChange, handleBlur, handleSubmit, values, isSubmitting}) =>
                            <StyledFormArea>
                                
                                <MyTextInput 
                                    label="Address"
                                    store={true}
                                    onChangeText={handleChange('address')}
                                    value={values.address}
                                />
                                
                                <MyTextInput 
                                    label="Contact Number"
                                    store={true}
                                    onChangeText={handleChange('contact')}
                                    value={values.contact}
                                />
                                <MyTextInput 
                                    label="Email Address"
                                    store={true}
                                    onChangeText={handleChange('email')}
                                    value={values.email}
                                />
                                <MyTextInput 
                                    label="Website"
                                    store={true}
                                    onChangeText={handleChange('website')}
                                    value={values.website}
                                />

                                <ExtraView store={true}>
                                    <TextLink onPress={() => navigation.navigate("MapScreen", {storeName, locDetails, location})}>
                                        <TextLinkContent store={true}>Store Location</TextLinkContent>
                                    </TextLink>
                                    
                                </ExtraView>
                                {(location?.latitude !== undefined && <StyledInputLabel location={true}>Latitude: {location.latitude}</StyledInputLabel>)}
                                {(location?.longitude !== undefined && <StyledInputLabel location={true}>Longitude: {location.longitude}</StyledInputLabel>)}

                                { !isSubmitting && <StyledButton store={true} onPress={handleSubmit}>
                                    <ButtonText store={true}>SAVE</ButtonText>
                                </StyledButton> }
                                { isSubmitting && <StyledButton store={true} disabled={true}>
                                    <ActivityIndicator size="large" color={primary}/>
                                </StyledButton> }
                                
                            </StyledFormArea>
                        }

                    </Formik>
                </DashboardContainer>
            </InnerContainer>
        </ImageBackground>
    </StyledContainer>
  )
};

const MyTextInput = ({ label, store = false, ...props}) =>{
    return(
        <View>
            <StyledInputLabel storeDetails={store} >{label}</StyledInputLabel>
            <StyledTextInput storeDetails={store} {...props} />
        </View>
    )
}



export default AddStoreDetailsScreen
