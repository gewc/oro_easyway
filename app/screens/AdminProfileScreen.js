import React, { useState, useEffect } from 'react'
import { StyleSheet, View, ActivityIndicator, Modal } from "react-native"
import { StatusBar } from 'expo-status-bar'
import { Formik } from 'formik'

import Constants from "expo-constants";

const StatusBarHeight = Constants.statusBarHeight;

import { Octicons, Ionicons } from '@expo/vector-icons' 

import { 
    Colors, StyledContainer, InnerContainer, PageTitle, StyledFormArea,  LeftIcon, MsgBox,  StyledInputLabel, StyledTextInput, StyledButton, ButtonText, Avatar, RightIcon, OuterdModalView, InnerModalView } from '../components/styles'

import axios from 'axios'
axios.defaults.baseURL = 'https://oro-easyway.onrender.com/api/v1';
//axios.defaults.baseURL = 'http://192.168.254.148:8080/api/v1';

const { primary, brand, darkLight } = Colors;


const AdminProfileScreen = ({navigation, route}) => {
    const [hidePassword, setHidePassword] = useState(true);
    const [message, setMessage] = useState();
    const [messageType, setMessageType] = useState();
    const [visibleUpdate, setVisibleUpdate] = useState(false);
    const [messageModal, setMessageModal] = useState('');
    const [messageTypeModal, setMessageTypeModal] = useState();
    const {userData} = route.params
    const data = userData.result
    console.log("userData", route.params)

    const handleUpdate = async (values, setSubmitting) => {

        await axios.patch('/users/'+data._id,values)
            .then((response) => {
                const result = response.data;
                const { message, status } = result;
                

                if(status !== "SUCCESS"){
                    handleMessage(message, status)
                } else {
                    handleMessage(message, status)
                }
                setSubmitting(false)
            })
            .catch( error => {
                console.log(error.message)
                setSubmitting(false)
                handleMessage("An error occured. Check your network and try again!")
            });
    }

    const handleChangePass = async (values, setSubmitting) => {
        console.log(data._id)
        await axios.patch('/users/changepass/'+data._id,values)
            .then((response) => {
                const result = response.data;
                const { message, status } = result;
                

                if(status !== "SUCCESS"){
                    handleMessage(message, status)
                } else {
                    handleMessage(message, status)
                }
                setSubmitting(false)
                setVisibleUpdate(!visibleUpdate)
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

    const handleMessageModal = (message, type = 'FAILED') => {
        setMessageModal(message);
        setMessageTypeModal(type);
    }

  return (
    <StyledContainer dashbaord={true}>
        <StatusBar style='dark' />
        
        <InnerContainer profile={true}>
            <PageTitle>My Profile</PageTitle>

            <Avatar resizeMode="contain" source={require('./../assets/logo.png')}/>
            
            <Formik
                initialValues={ data || {name: '', address: '', email: ''}}
                enableReinitialize
                onSubmit={(values,{setSubmitting}) => {
                    console.log(values)
                    if(values.address == '' || values.name == '' || values.email == ''){
                        handleMessage(`Please don't leave a blank!`)
                        setSubmitting(false)
                    }else{
                        handleUpdate(values, setSubmitting)
                    }
                }}
            >
                {({handleChange, handleBlur, handleSubmit, values, isSubmitting}) =>

                <StyledFormArea>
                    <MyTextInput 
                        storeProfile={true}
                        label = "Name"
                        onChangeText={handleChange('name')}
                        value={values.name.toUpperCase()}
                    />
                    <MyTextInput 
                        storeProfile={true}
                        label = "Address"
                        onChangeText={handleChange('address')}
                        value={values.address}
                    />
                    <MyTextInput 
                        storeProfile={true}
                        label = "Email Address"
                        onChangeText={handleChange('email')}
                        value={values.email}
                    />

                    <MsgBox type={messageType}>{message}</MsgBox>
                    <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-evenly'
                    }}>
                        { !isSubmitting && <StyledButton adminStoreProfile={true} onPress={handleSubmit}>
                            <ButtonText adminStoreProfile={true}>Update</ButtonText>
                        </StyledButton>}
                        { isSubmitting && <StyledButton adminStoreProfile={true} disabled={true}>
                            <ActivityIndicator size="small" color={primary}/>
                        </StyledButton> }

                        <StyledButton adminStoreProfile={true} onPress={() => {setVisibleUpdate(true)}}>
                            <ButtonText adminStoreProfile={true} adjustsFontSizeToFit={true} numberOfLines={1}>Change Password</ButtonText>
                        </StyledButton>
                    </View>

                </StyledFormArea>

            }
                                    
            </Formik>

            <Modal
                    animationType='slide'
                    transparent={true}
                    visible={visibleUpdate}
                    onRequestClose={() => {
                        setVisibleUpdate(!visibleUpdate)
                        handleMessageModal('')
                    }}
                >
                    <OuterdModalView>
                        <InnerModalView>
                            <PageTitle>Change Password</PageTitle>
                            <Formik
                                initialValues={{password: '', confirmPass: ''}}
                                onSubmit={(values,{setSubmitting}) => {
                                    //console.log(values);
                                    if(values.password == '' || values.confirmPass == '' ){
                                        handleMessageModal(`Please don't leave a blank!`)
                                        setSubmitting(false)
                                    }else if(values.password != values.confirmPass ){
                                        handleMessageModal(`Password and Confirm Password doesn't match!`)
                                        setSubmitting(false)
                                    }else{
                                        handleChangePass(values, setSubmitting)
                                    }
                                    
                                }}
                            >
                                {({handleChange, handleBlur, handleSubmit, values, isSubmitting}) =>
                                <StyledFormArea product={true}>
                                    <MyTextInput 
                                        storeProfile={true}
                                        label="New Password"
                                        onChangeText={handleChange('password')}
                                        onBlur={handleBlur('password')}
                                        value={values.password}
                                        secureTextEntry={hidePassword}
                                        isPassword={true}
                                        hidePassword={hidePassword}
                                        setHidePassword={setHidePassword}

                                    />

                                    <MyTextInput 
                                        storeProfile={true}
                                        label="Confirm Password"
                                        onChangeText={handleChange('confirmPass')}
                                        onBlur={handleBlur('confirmPass')}
                                        value={values.confirmPass}
                                        secureTextEntry={hidePassword}
                                        isPassword={true}
                                        hidePassword={hidePassword}
                                        setHidePassword={setHidePassword}

                                    />

                                    <MsgBox type={messageTypeModal} productModal={true}>{messageModal}</MsgBox>

                                    { !isSubmitting && <StyledButton onPress={handleSubmit}>
                                        <ButtonText>Submit</ButtonText>
                                    </StyledButton>}
                                    { isSubmitting && <StyledButton  disabled={true}>
                                        <ActivityIndicator size="large" color={primary}/>
                                    </StyledButton> }

                                </StyledFormArea>

                            }                               
                            </Formik>

                        </InnerModalView>
                    </OuterdModalView>
                </Modal>
                
        </InnerContainer>
    </StyledContainer>
  )
}

const MyTextInput = ({ label, icon, isPassword, hidePassword, setHidePassword,  ...props}) =>{
    return(
        <View>
            <StyledInputLabel {...props} >{label}</StyledInputLabel>
            <LeftIcon >
                <Octicons name={icon} size={30}  color={brand} />
            </LeftIcon>
            <StyledTextInput {...props} />
            {isPassword && (
                <RightIcon onPress={() => setHidePassword(!hidePassword)}>
                    <Ionicons name={hidePassword ? 'md-eye-off' : 'md-eye'} size={30} color={darkLight} />
                </RightIcon>
            )}
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    map: {
      width: '100%',
      height: '30%',
      bottom: 10,
      top: 1,
      
    },
  });

export default AdminProfileScreen
