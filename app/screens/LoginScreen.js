import React, { useState } from 'react'
import { StatusBar } from 'expo-status-bar'
import { Formik } from 'formik'
import { View, ActivityIndicator } from 'react-native'

import { Octicons, Ionicons, Fontisto } from '@expo/vector-icons'

import { 
    Colors, StyledContainer, InnerContainer, PageLogo, PageTitle, StyledFormArea, LeftIcon, StyledInputLabel, StyledTextInput, RightIcon, StyledButton, ButtonText, MsgBox, Line, ExtraView, ExtraText, TextLink, TextLinkContent } from '../components/styles'

import KeyboardingAvoidWrapper from '../components/KeyboardingAvoidWrapper'

import axios from 'axios'
axios.defaults.baseURL = 'https://oro-easyway.onrender.com/api/v1';

const { primary, brand, darkLight } = Colors;

const LoginScreen = ({navigation}) => {
    const [hidePassword, setHidePassword] = useState(true);
    const [message, setMessage] = useState();
    const [messageType, setMessageType] = useState();

    const handleLogin = async (credentials, setSubmitting) => {
        handleMessage(null)
        await axios.post('/users/login/', credentials)
            .then((response) => {
                const result = response.data;
                
                const { message, status, data } = result;

                if(status !== "SUCCESS"){
                    handleMessage(message, status)
                } else {
                    navigation.dispatch(
                        StackActions.replace('AdminDashboardScreen', {...data[0]})
                      );
                }
                setSubmitting(false)
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
                            return false;
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
                                placeholder="Username"
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
                            { !isSubmitting && <StyledButton>
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
