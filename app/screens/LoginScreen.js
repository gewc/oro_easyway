import React, { useState } from 'react'
import { StatusBar } from 'expo-status-bar'
import { Formik } from 'formik'
import { View } from 'react-native'

import { Octicons, Ionicons, Fontisto } from '@expo/vector-icons'

import { 
    Colors, StyledContainer, InnerContainer, PageLogo, PageTitle, StyledFormArea, LeftIcon, StyledInputLabel, StyledTextInput, RightIcon, StyledButton, ButtonText, MsgBox, Line, ExtraView, ExtraText, TextLink, TextLinkContent } from '../components/styles'

import KeyboardingAvoidWrapper from '../components/KeyboardingAvoidWrapper'

const { primary, brand, darkLight } = Colors;

const LoginScreen = ({navigation}) => {
    const [hidePassword, setHidePassword] = useState(true);
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

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
                    }}
                />
                <PageTitle>Account Login</PageTitle>

                <Formik
                    initialValues={{email:'', password: ''}}
                    onSubmit={(values) => {
                        console.log(values);
                        if(values.email === "" || values.password ===""){
                            setError(true)
                            setErrorMessage("Please don't leave a blank!")
                            return false;
                        }
                        
                        navigation.navigate("Dashboard")
                    }}
                >
                    {({handleChange, handleBlur, handleSubmit, values}) =>
                        <StyledFormArea>

                            <MsgBox >{errorMessage}</MsgBox>

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
                            <StyledButton onPress={handleSubmit}>
                                <ButtonText>Login</ButtonText>
                            </StyledButton>
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
