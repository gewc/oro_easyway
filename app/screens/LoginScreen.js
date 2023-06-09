import React, { useEffect, useState } from 'react'
import { StatusBar } from 'expo-status-bar'
import { Formik } from 'formik'
import { View, ActivityIndicator, Alert, BackHandler } from 'react-native'
import { StackActions } from '@react-navigation/native';
import * as Network from 'expo-network';

import { Octicons, Ionicons, Fontisto } from '@expo/vector-icons'

import { 
    Colors, StyledContainer, InnerContainer, PageLogo, PageTitle, StyledFormArea, LeftIcon, StyledInputLabel, StyledTextInput, RightIcon, StyledButton, ButtonText, MsgBox, Line, ExtraView, ExtraText, TextLink, TextLinkContent } from '../components/styles'

import KeyboardingAvoidWrapper from '../components/KeyboardingAvoidWrapper'

import axios from 'axios'
axios.defaults.baseURL = 'https://oro-easyway.onrender.com/api/v1';
// axios.defaults.baseURL = 'http://192.168.254.148:8080/api/v1';

const { primary, brand, darkLight } = Colors;

const LoginScreen = ({navigation}) => {
    const [hidePassword, setHidePassword] = useState(true);
    const [message, setMessage] = useState();
    const [messageType, setMessageType] = useState();
    const [isConnectedToNet, setIsConnectedToNet] = useState(null);

    const handleLogin = async (credentials, setSubmitting) => {
        handleMessage(null)
        await axios.post('/users/login', credentials)
            .then((response) => {
                const result = response.data;
                console.log(result)
                const { message, status, data } = result;

                if(status !== "SUCCESS"){
                    handleMessage(message, status)
                } else {
                    navigation.dispatch(
                        StackActions.replace('AdminDashboardScreen', {data: data})
                      );
                }
                setSubmitting(false)
            })
            .catch( error => {
                console.log('Login Error: ',error.message)
                setSubmitting(false)
                handleMessage("An error occured. Check your network and try again!")
            });
    }

    const handleMessage = (message, type = 'FAILED') => {
        setMessage(message);
        setMessageType(type);
    }

    const checkInternet = async () => {
       let net =  await Network.getNetworkStateAsync();

       if(isConnectedToNet == null){
            if(!net.isInternetReachable){ //if there is no internet
                Alert.alert("No Internet!", "Please check your internet connection", [
                    {
                        text: "Ok",
                        onPress: () => BackHandler.exitApp(),
                    },
                ])
                return true;

            }
        }
       setIsConnectedToNet(net.isInternetReachable)
    }

    useEffect(() => {
        checkInternet()
        
    })

  return (
    <KeyboardingAvoidWrapper>
        <StyledContainer>
            <StatusBar style='dark' />
            <InnerContainer>
                <PageLogo 
                    resizeMode="cover" 
                    overflow={1} 
                    source={require('./../assets/logo.png')}
                    style={{
                        width: 150,
                        height: 150,
                        borderWidth: 2,
                        borderColor: 'gray',
                        marginBottom: 30,
                    }}
                />
                <PageTitle>Admin Login</PageTitle>

                <Formik
                    initialValues={{email:'', password: ''}}
                    onSubmit={(values, {setSubmitting}) => {
                        console.log(values);
                        if(values.email === "" || values.password ===""){
                            handleMessage("All field are required.")
                            setSubmitting(false)
                        }else{
                            handleLogin(values,setSubmitting)
                        }
                        
                    }}
                >
                    {({handleChange, handleBlur, handleSubmit, values, isSubmitting}) =>
                        <StyledFormArea>

                            <MsgBox type={messageType} >{message}</MsgBox>

                            <MyTextInput 
                                label="Email Address"
                                icon="person-fill" 
                                iconLeft="15px"
                                placeholder="Email"
                                placeholderTextColor={darkLight}
                                onChangeText={handleChange('email')}
                                value={values.email}
                                keyboardType="email-address"
                            />
                            <MyTextInput 
                                label="Password"
                                icon="lock" 
                                placeholder="Password"
                                placeholderTextColor={darkLight}
                                onChangeText={handleChange('password')}
                                onBlur={handleBlur('password')}
                                value={values.password}
                                secureTextEntry={hidePassword}
                                isPassword={true}
                                hidePassword={hidePassword}
                                setHidePassword={setHidePassword}

                            />

                            { !isSubmitting && <StyledButton onPress={handleSubmit}>
                                <ButtonText>Login</ButtonText>
                            </StyledButton>}
                            { isSubmitting && <StyledButton>
                                <ActivityIndicator size="large" color={primary} />
                            </StyledButton>}

                            {/* <Line />
                            <StyledButton google={true} onPress={handleSubmit}>
                                <Fontisto name="google" color={primary} size={25}/>
                                <ButtonText google={true}>Sign in with Google</ButtonText>
                            </StyledButton>
                            <ExtraView>
                                <ExtraText>Don't have an account yet? </ExtraText>
                                <TextLink onPress={() => navigation.navigate("Register")}>
                                    <TextLinkContent>Signup Here</TextLinkContent>
                                </TextLink>
                            </ExtraView> */}
                        </StyledFormArea>
                    }

                </Formik>
            </InnerContainer>
        </StyledContainer>
    </KeyboardingAvoidWrapper>
  )
};

const MyTextInput = ({ label, icon, isPassword, hidePassword, setHidePassword, ...props}) =>{
    return(
        <View>
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

export default LoginScreen
