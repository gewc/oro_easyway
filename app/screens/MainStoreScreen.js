import React, { useState, useEffect } from 'react'
import { ImageBackground, View, ActivityIndicator } from "react-native"
import { StatusBar } from 'expo-status-bar'
import { Formik } from 'formik'
import AsyncStorage from '@react-native-async-storage/async-storage';

import { 
    Colors, StyledContainer, InnerContainer, PageTitle, StyledFormArea, MsgBox, StyledButton, ButtonText, PageLogo, DashboardContainer, Avatar, StyledTextInput, StyledInputLabel } from '../components/styles'

import axios from 'axios'
axios.defaults.baseURL = 'https://oro-easyway.onrender.com/api/v1';

const { primary, brand, darkLight } = Colors;

const MainStoreScreen = ({navigation, route}) => {
    const [message, setMessage] = useState();
    const [messageType, setMessageType] = useState();
    const [storeRequest, setStoreRequest] = useState(null);
    const [storeProfile, setStoreProfile] = useState(null);
    const [isChecking, setIsChecking] = useState(false);

    const acctTypes = [
        { label: 'Admin', value: 'Admin' },
        { label: 'Store Owner', value: 'Store Owner' },
        { label: 'Staff', value: 'Staff' },
        { label: 'Client', value: 'Client' },
    ]

    const handleRegisterStore = async (data, setSubmitting, setIsChecking) =>{
        handleMessage(null)
        clearAllAsyncStorage()
        
        await axios.post('/registers',data)
            .then((response) => {
                const result = response.data;
                const { message, status, data } = result;
                const {store_name} = data;
                console.log("Register Result", result)

                if(status !== "SUCCESS"){
                    handleMessage(message, status)
                    setIsChecking(true)
                } else {
                    handleMessage(message, status)
                    setIsChecking(true)
                    storeOjectData('@store',{storeName: store_name})
                }
                setSubmitting(false)
            })
            .catch( error => {
                console.log(error.message)
                setSubmitting(false)
                handleMessage("An error occured. Check your network and try again!")
            });

    }

    const handleCheckStore = async (data, setSubmitting, navigation) =>{
        handleMessage(null)
        await axios.get(`/registers/store/${data.storeName}`)
            .then((response) => {
                const result = response.data;
                const { message, status, data } = result;
                console.log("Check Register Result", result)

                if(status == "SUCCESS"){
                    if(data.register.status == "Approved"){ // if store is approved
                        handleMessage(`Your store status is approved.`, status)
                        mergeOjectData('@store', {status: "Store Details"})
                        mergeOjectData('@store', {storeName: data.register.store_name})

                        if(data.store == null){ //store has no details yet
                            navigation.navigate('AddStoreDetailsScreen', {storeName: data.register.store_name, location: ''})
                        }else{ //store is already had details
                            console.log('Store Menu.')
                        }
                    }else{ // if store is still pending
                        handleMessage(`Your store registration is still ${data.register.status.toLowerCase()}.`)
                    }
                } else {
                    
                    handleMessage(message)
                }
                setSubmitting(false)
            })
            .catch( error => {
                console.log(error.message)
                setSubmitting(false)
                handleMessage("An error occured. Check your network and try again!")
            });

    }


    useEffect(() => {
        getObjectData('@store',setStoreRequest);
        getObjectData('@storeProfile',setStoreProfile);
        console.log('Store Name',storeRequest)
        console.log('Store Profile:', storeProfile)
        if(storeRequest !== null && storeRequest?.status == undefined){
            setIsChecking(true)
        } else if (storeRequest !== null && storeRequest?.status == 'Store Details') {
            setIsChecking(true)
            navigation.navigate('AddStoreDetailsScreen', {storeName: storeRequest?.storeName, locDetails: '', location: {}})
        } else if (storeRequest !== null && storeRequest?.status == 'Main Menu') {
            setIsChecking(true)
            navigation.navigate('StoreMenuScreen', {storeName: storeRequest?.storeName, data: storeProfile})
            console.log('Main Menu Screen')
        }
    }, [])

    const handleMessage = (message, type = 'FAILED') => {
        setMessage(message);
        setMessageType(type);
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

    const getObjectData = async (key, setData) => {
        try {
          const jsonValue = await AsyncStorage.getItem(key);
          jsonValue != null ? setData(JSON.parse(jsonValue)) : null;
        } catch(e) {
            console.log(e.message)
        }
    }

    const clearAllAsyncStorage = async () => {
        try {
            await AsyncStorage.clear()
        } catch(e) {
            console.log(e.message)
        }
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
                            borderColor: "white"
                        }}
                    />
                    <PageTitle dashbaord={true}>ORO - EASY WAY</PageTitle>
                    <MsgBox type={messageType}>{message}</MsgBox>
                    <Formik
                        initialValues={ storeRequest || {storeName: '', location: ''}}
                        enableReinitialize
                        onSubmit={(values,{setSubmitting, resetForm}) => {
                            console.log(values);
                            if(values.storeName !== ""){
                                // navigation.navigate('AddStoreDetailsScreen', values)
                                if(!isChecking){
                                    handleRegisterStore(values, setSubmitting, setIsChecking);
                                }else{
                                    handleCheckStore(values, setSubmitting, navigation);
                                }
                            }else{
                                handleMessage("Please type your Store Name!")
                                setSubmitting(false)
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
                                
                                { (!isSubmitting && !isChecking) && <StyledButton findMaterial={true} onPress={handleSubmit}>
                                    <ButtonText findMaterial={true}>Register</ButtonText>
                                </StyledButton> }
                                { (isSubmitting && !isChecking) && <StyledButton findMaterial={true} disabled={true}>
                                    <ActivityIndicator size="large" color={primary}/>
                                </StyledButton> }

                                { (!isSubmitting && isChecking) && <StyledButton findMaterial={true} onPress={handleSubmit}>
                                    <ButtonText findMaterial={true}>Check Status</ButtonText>
                                </StyledButton> }
                                { (isSubmitting && isChecking) && <StyledButton findMaterial={true} disabled={true}>
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
            <StyledTextInput store={store} {...props} />
            <StyledInputLabel store={store} >{label}</StyledInputLabel>
        </View>
    )
}


export default MainStoreScreen
