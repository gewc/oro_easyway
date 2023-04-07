import React, { useState, useEffect } from 'react'
import { StatusBar } from 'expo-status-bar'
import { Formik } from 'formik'
import { View, Text, ActivityIndicator } from 'react-native'
import { Dropdown } from 'react-native-element-dropdown';

import { Octicons, Ionicons, Fontisto } from '@expo/vector-icons'

import { 
    Colors, StyledContainer, InnerContainer, PageLogo, PageTitle, StyledFormArea, LeftIcon, StyledInputLabel, StyledTextInput, RightIcon, StyledButton, ButtonText, MsgBox, Line, ExtraView, ExtraText, TextLink, TextLinkContent } from '../components/styles'

import KeyboardingAvoidWrapper from '../components/KeyboardingAvoidWrapper'

import axios from 'axios'
axios.defaults.baseURL = 'https://oro-easyway.onrender.com/api/v1';

const { primary, brand, darkLight } = Colors;

const RegisterScreen = ({navigation}) => {
    const [hidePassword, setHidePassword] = useState(true);
    const [message, setMessage] = useState();
    const [messageType, setMessageType] = useState();

    const acctTypes = [
        { label: 'Admin', value: 'Admin' },
        { label: 'Store Owner', value: 'Store Owner' },
        { label: 'Staff', value: 'Staff' },
        { label: 'Client', value: 'Client' },
    ]

    const handleAddUser = async (data, setSubmitting, resetForm) =>{
        handleMessage(null)
        await axios.post('/users/',data)
            .then((response) => {
                const result = response.data;
                
                const { message, status, data } = result;

                if(status !== "SUCCESS"){
                    handleMessage(message, status)
                } else {
                    handleMessage(message, status)
                }
                resetForm();
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
                    resizeMode="contain" 
                    overflow={1} 
                    source={require('./../assets/logo.png')}
                    style={{
                        width: 80,
                        height: 80,
                    }}
                />
                <PageTitle>Add Account</PageTitle>
                
                <Formik
                    initialValues={{email:'', password: '', name:'', address: '', confirm_pass: '', acctType: 'Admin'}}
                    onSubmit={(values, {setSubmitting, resetForm}) => {
                        console.log(values);
                        if(values){
                            if(values.password == values.confirm_pass){
                                handleAddUser(values, setSubmitting, resetForm);
                            }else{
                                handleMessage("Password and Confirm Password did not match!")
                                setSubmitting(false)
                            }
                            
                        }else{
                            setSubmitting(false)
                        }
                    }}
                >
                    {({handleChange, handleBlur, handleSubmit, values, setFieldValue, isSubmitting}) =>
                        <StyledFormArea>
                            <MyTextInput 
                                label="Full name"
                                icon="person" 
                                placeholder="Full name"
                                placeholderTextColor={darkLight}
                                onChangeText={handleChange('name')}
                                onBlur={handleBlur('name')}
                                value={values.name}
                            />
                            
                            <MyTextInput 
                                label="Email Address"
                                icon="email" 
                                placeholder="Email Address"
                                placeholderTextColor={darkLight}
                                onChangeText={handleChange('email')}
                                value={values.email}
                                keyboardType="email-address"
                            />

                            <MyTextInput 
                                label="Address"
                                icon="home" 
                                placeholder="Address"
                                placeholderTextColor={darkLight}
                                onChangeText={handleChange('address')}
                                value={values.address}
                            />
                            
                            {/* <MyDropDown 
                                options={acctTypes} 
                                onChange={value => setFieldValue('acctType', value.value)} 
                                value={values.acctType}
                            /> */}
                            
                            <MyTextInput 
                                label="Password"
                                icon="locked" 
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

                            <MyTextInput 
                                label="Confirm Password"
                                icon="locked" 
                                placeholder="Confirm Password"
                                placeholderTextColor={darkLight}
                                onChangeText={handleChange('confirm_pass')}
                                onBlur={handleBlur('confirm_pass')}
                                value={values.confirm_pass}
                                secureTextEntry={hidePassword}
                                isPassword={true}
                                hidePassword={hidePassword}
                                setHidePassword={setHidePassword}

                            />
                            
                            <MsgBox type={messageType}>{message}</MsgBox>
                            { !isSubmitting && <StyledButton onPress={handleSubmit}>
                                <ButtonText>Submit</ButtonText>
                            </StyledButton> }
                            { isSubmitting && <StyledButton disabled={true}>
                                <ActivityIndicator size="large" color={primary}/>
                            </StyledButton> }
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
                <Fontisto name={icon} size={30}  color={brand} />
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

const defaultValue = (options,value) =>{
    return options ? options.find(option => option.value === value) : "";
}

const MyDropDown = ({ options, value, onChange}) =>{
    return(
        <Dropdown 
            data={options} 
            value={defaultValue(options,value)}
            onChange={ value => onChange(value)}
            maxHeight={300}
            labelField="label"
            valueField="value"
            placeholder="Account Type"
            renderItem={renderItem}
            renderLeftIcon={() => (
                <Fontisto
                style={{
                    marginRight: 5,
                }}
                color="#1434A4"
                name="universal-acces"
                size={30}
                />
            )}
            style={{
                height: 60,
                backgroundColor: '#e5e7eb',
                borderRadius: 5,
                padding: 15,
                width: "100%",
                marginTop: 15,
                marginBottom: 10,
            }}
            placeholderStyle= {{
                fontSize: 16,
                color: "#9ca3af",
                paddingLeft: 5,
                }}
        
        />
    )
}

const renderItem = item => {
    return (
      <View style={{
        padding: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <Text style={{
            flex: 1,
            fontSize: 16,
        }}>{item.label}</Text>
      </View>
    );
  };


export default RegisterScreen
