import React, { useState, useEffect } from 'react'
import { ImageBackground, View, ActivityIndicator } from "react-native"
import { StatusBar } from 'expo-status-bar'
import { Formik } from 'formik'
import * as Device from 'expo-device';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StackActions } from '@react-navigation/native';

import { 
    Colors, StyledContainer, InnerContainer, PageTitle, StyledFormArea, MsgBox, StyledButton, ButtonText, PageLogo, DashboardContainer, Avatar, StyledTextInput, StyledInputLabel } from '../components/styles'

import axios from 'axios'
axios.defaults.baseURL = 'https://oro-easyway.onrender.com/api/v1';
// axios.defaults.baseURL = 'http://192.168.4.148:8080/api/v1';

const { primary, brand, darkLight } = Colors;

const MainStoreScreen = ({navigation, route}) => {
    const [message, setMessage] = useState();
    const [messageType, setMessageType] = useState();
    const [deviceId, setDeviceId] = useState(null);
    const [storeRequest, setStoreRequest] = useState(null);
    const [storeProfile, setStoreProfile] = useState(null);
    const [isChecking, setIsChecking] = useState(false);
    const [isCheckingDevice, setIsCheckingDevice] = useState(true);

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
                            navigation.dispatch(
                                StackActions.replace('StoreMenuScreen', {storeName: data.register.store_name, data: storeProfile})
                              );
                            // navigation.navigate('StoreMenuScreen', {storeName: data.register.store_name, data: storeProfile})
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

    const checkDeviceId = async (data, navigation) =>{
        await axios.get(`/registers/device/${data.deviceId}`)
            .then((response) => {
                const result = response.data;
                const { message, status, data } = result;
                console.log("Check Device Result", result)
                
                if(status == "SUCCESS"){
                    
                    if(data.register.status == "Approved"){ // if store is approved
                        // handleMessage(`Your store status is approved.`, status)
                        mergeOjectData('@store', {status: "Store Details"})
                        mergeOjectData('@store', {storeName: data.register.store_name})

                        if(data.store == null){ //store has no details yet
                            navigation.dispatch(
                                StackActions.replace('AddStoreDetailsScreen', {storeName: data.register.store_name, location: ''})
                              );
                            // navigation.navigate('AddStoreDetailsScreen', {storeName: data.register.store_name, location: ''})
                        }else{ //store is already had details
                            console.log('Store Menu.')
                            storeOjectData('@storeProfile', data.store)

                            navigation.dispatch(
                                StackActions.replace('StoreMenuScreen', {storeName: data.register.store_name, data: data.store})
                              );
                            // navigation.navigate('StoreMenuScreen', {storeName: data.register.store_name, data: data.store})
                        }
                    }else{ // if store is still pending
                        handleMessage(`Your store registration is still ${data.register.status.toLowerCase()}.`)
                    }
                } else {
                    
                    //handleMessage(message)
                }

                setIsCheckingDevice(false)
            })
            .catch( error => {
                setIsCheckingDevice(false)
                console.log(error.message)
                handleMessage("An error occured. Check your network and try again!")
            });

    }


    useEffect(() => {
        console.log('Device Id', Device.osInternalBuildId)

        const did = Device.osInternalBuildId
        setDeviceId(did) // Device ID
        let data = { deviceId: did }
        checkDeviceId(data, navigation);
        
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
                { !isCheckingDevice && <DashboardContainer>
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
                                const result = {...values, deviceId}
                                console.log('Registry Values', result)
                                if(!isChecking){
                                    handleRegisterStore(result, setSubmitting, setIsChecking);
                                }else{
                                    handleCheckStore(result, setSubmitting, navigation);
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
                </DashboardContainer>}
                { isCheckingDevice && <DashboardContainer>
                        <ActivityIndicator size="large" color={primary}/> 
                        <ButtonText>Please wait while we check your device.</ButtonText>
                    </DashboardContainer>}
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
