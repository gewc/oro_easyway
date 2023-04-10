import React, { useState, useEffect } from 'react'
import { ImageBackground, View, ActivityIndicator } from "react-native"
import { StatusBar } from 'expo-status-bar'
import { Formik } from 'formik'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StackActions } from '@react-navigation/native';

import { 
    Colors, StyledContainer, InnerContainer, PageTitle, StyledFormArea, MsgBox, StyledButton, ButtonText, PageLogo, DashboardContainer, SubTitle, StyledTextInput, StyledInputLabel, ExtraView, TextLink, TextLinkContent, ExtraText } from '../components/styles'

import axios from 'axios'
axios.defaults.baseURL = 'https://oro-easyway.onrender.com/api/v1';

const { primary, brand, darkLight } = Colors;

const AdminAddStoreDetailsScreen = ({navigation, route}) => {
    const [message, setMessage] = useState();
    const [messageType, setMessageType] = useState();
    const {data, locDetails, location} = route.params;
    //console.log(route.params)

    const acctTypes = [
        { label: 'Admin', value: 'Admin' },
        { label: 'Store Owner', value: 'Store Owner' },
        { label: 'Staff', value: 'Staff' },
        { label: 'Client', value: 'Client' },
    ]

    const handleStoreDetails = async (data, setSubmitting, resetForm) => {
        handleMessage(null)
        await axios.post('/stores',data)
            .then((response) => {
                const result = response.data;
                const { message, status, data } = result;
                const {name} = data;

                if(status !== "SUCCESS"){
                    handleMessage(message, status)
                } else {
                    handleMessage("You added new store.", status)
                }
                setSubmitting(false)
                resetForm()
                
            })
            .catch( error => {
                console.log(error.message)
                setSubmitting(false)
                handleMessage("An error occured. Check your network and try again!")
            });
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
                            width: 90,
                            height: 90,
                            borderWidth: 2,
                            borderColor: "white",
                            marginBottom: 10
                        }}
                    />
                    <SubTitle storeDetails={true}>ADD HARDWARE STORE</SubTitle>
                    <MsgBox type={messageType}>{message}</MsgBox>
                    <Formik
                        initialValues={{ storeName: '', address: '', contact: '', email: '', website: ''}}
                        onSubmit={(values, {setSubmitting, resetForm}) => {
                            const data = {...values, location: JSON.stringify(location)}
                            console.log(data);
                            if(data.address == '' || data.contact == '' || data.email == '' || data.website == '' || data.storeName == '' || data.location == ''){
                                handleMessage(`Please don't leave a blank!`)
                                setSubmitting(false)
                            }else if(Object.keys(location).length < 2){
                                handleMessage(`Please select you store location!`)
                                setSubmitting(false)
                            }else{
                                handleStoreDetails(data, setSubmitting, resetForm)
                            }
                            
                        }}
                    >
                        {({handleChange, handleBlur, handleSubmit, values, isSubmitting}) =>
                            <StyledFormArea>

                                <MyTextInput 
                                    label="Store Name"
                                    store={true}
                                    onChangeText={handleChange('storeName')}
                                    value={values.storeName}
                                />

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
                                    <TextLink onPress={() => navigation.navigate("AdminMapScreen", {storeName: values.storeName, locDetails, location})}>
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



export default AdminAddStoreDetailsScreen
