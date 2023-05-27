import React, { useState, useEffect } from 'react'
import { View, FlatList, Modal, ActivityIndicator, Text, ImageBackground } from "react-native"
import { StatusBar } from 'expo-status-bar'
import { Formik } from 'formik'

import { Octicons, Entypo, MaterialIcons } from '@expo/vector-icons'

import { 
    Colors, StyledContainer, InnerContainer, PageTitle, StyledFormArea,  LeftIcon, MsgBox,  ProductContainer, StyledTextInput, StyledButton, ButtonText, OuterdModalView, InnerModalView, StyledInputLabel } from '../components/styles'

import axios from 'axios'
axios.defaults.baseURL = 'https://oro-easyway.onrender.com/api/v1';
// axios.defaults.baseURL = 'http://192.168.254.148:8080/api/v1';


const { primary, brand, darkLight, green, red, tertiary } = Colors;

const RegistrationListScreen = ({navigation, route}) => {
    // const { data } = route.params
    const [message, setMessage] = useState();
    const [messageType, setMessageType] = useState();
    const [messageModal, setMessageModal] = useState('');
    const [messageTypeModal, setMessageTypeModal] = useState();
    const [visible, setVisible] = useState(false);
    const [oldProductData, setOldProductData] = useState([]);
    const [productData, setProductData] = useState([]);
    const [ind, setInd] = useState(0)

    const getRegisters = async () => {
        handleMessage("Loading...", "Default")
        await axios.get(`/registers`)
            .then((response) => {
                const result = response.data;
                const { message, status, data } = result;
                console.log("Get Register Result", data)


                if(status !== "SUCCESS"){
                    handleMessage(message, status)
                } else {
                    if(data.length < 1){
                        setProductData(data)
                        setOldProductData(data)
                        handleMessage("There is no store yet.")
                    }else{
                        setProductData(data)
                        setOldProductData(data)
                        handleMessage("")
                    }
                    
                }
            })
            .catch( error => {
                console.log('Get All Register Error: ',error.message)
                handleMessage("An error occured. Check your network and try again!")
            });
    }

    const handleRegAction = async (_id, action) => {
        console.log(action)
        await axios.patch(`/registers/${_id}`, {status: action})
            .then((response) => {
                const result = response.data;
                const { message, status, data } = result;
                console.log("Update Registration Result", data)

                if(status !== "SUCCESS"){
                    handleMessage(message, status)
                } else {
                    handleMessage(message, status)
                    getRegisters()
                }
            })
            .catch( error => {
                console.log('Register Action Error: ',error.message)
                handleMessageModal("An error occured. Check your network and try again!")
            });
    }

    const searchProduct = (text) => {
        if(text == ''){
            setProductData(oldProductData);
        }else{
            let tempList = productData.filter((item) => {
                return item.store_name.toLowerCase().indexOf(text.toLowerCase()) > -1
            })
    
            setProductData(tempList);
        }
        
        
    }

    const convertDateToString = (dbdate) => {
        let date = dbdate.split(' ')
        const nDate = new Date(date[0]);
        return nDate.toDateString();
    }

    const handleMessage = (message, type = 'FAILED') => {
        setMessage(message);
        setMessageType(type);
    }

    const handleMessageModal = (message, type = 'FAILED') => {
        setMessageModal(message);
        setMessageTypeModal(type);
    }


    useEffect(() => {
        getRegisters();
    }, [])



  return (
    <StyledContainer dashbaord={true}>
        <StatusBar style='dark' />
        {/* <Avatar resizeMode="contain" source={require('./../assets/logo.png')}/> */}
        <InnerContainer>
            <ProductContainer>
                <PageTitle >Store Registration's List</PageTitle>
                <StyledFormArea>
                    <MyTextInputSearch 
                        product={true}
                        icon="search"
                        setVisible={setVisible}
                        onChangeText={text => searchProduct(text)}
                    />
                    <MsgBox type={messageType} product={true}>{message}</MsgBox>

                </StyledFormArea>

                <FlatList 
                    data={productData}
                    showsVerticalScrollIndicator={false}
                    initialScrollIndex={ind}
                    renderItem={({item, index}) => 
                        <Item 
                            item={item} 
                            index={index} 
                            data={productData} 
                            convertDateToString={convertDateToString}
                            handleRegAction={handleRegAction}
                        />}
                    keyExtractor={item => item._id}
                    contentContainerStyle={{ paddingBottom: 50 }}
                    
                />


            </ProductContainer>
        </InnerContainer>
    </StyledContainer>
  )
}

const Item = ({item, index, data, convertDateToString, handleRegAction}) => (
    <View
        style={{
            width: '95%',
            borderRadius: 5,
            borderWidth: 0.5,
            borderWidth: 3,
            borderColor: darkLight,
            backgroundColor: item.status == 'Approved' ? green : item.status == 'Pending' ? 'gray' : red,
            alignSelf: 'center',
            marginTop: 15,
            marginBottom: index == data.length - 1 ? 30 : 0,
            alignItems: 'center',
            flexDirection: 'row',
            shadowColor: "#000",
            shadowOffset: {
                width: 0,
                height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
            padding: 5,
        }}
    >
        
        <MaterialIcons name="app-registration"  size={40}  color={primary}  
            style={{
                width: 40,
                height: 40,
                marginLeft:10
            }} />
        <View style={{ width: '60%',flexDirection: 'column', justifyContent:'space-evenly'}}>
            <Text style={{fontSize: 18,fontWeight: '800', marginLeft: 10, marginTop: 10, color:primary  }} adjustsFontSizeToFit={true} numberOfLines={1}>{item.store_name.toUpperCase()}</Text>
            <Text style={{fontSize: 14,marginLeft: 10, color:primary }}>Device ID: {item.device_id.substring(0, 50)}</Text>
            <Text style={{fontSize: 14,marginLeft: 10, color:primary }}>Date: {convertDateToString(item.created_at)}</Text>
            <Text style={{fontSize: 14,marginLeft: 10, marginBottom: 10, color: primary }}>Status: {item.status.substring(0, 50)}</Text>
        </View>
        { item.status == 'Pending' && <View style={{ width: '20%',flexDirection: 'column', justifyContent:'space-evenly'}}>
            <StyledButton approved={true} onPress={() => {handleRegAction(item._id,'Approved')}}>
                <ButtonText> <Entypo name='check' size={18}  color={primary} /> </ButtonText>
            </StyledButton>
            <StyledButton reject={true} onPress={() => {handleRegAction(item._id,'Reject')}}>
                <ButtonText> <Entypo name='cross' size={18}  color={primary} /> </ButtonText>
            </StyledButton>
            {/* <StyledButton view={true} onPress={() => {}}>
                <ButtonText register={true}> <Entypo name='eye' size={18}  color={primary} /> </ButtonText>
            </StyledButton> */}
        </View>}

        { item.status == 'Approved' && <View style={{ width: '20%',flexDirection: 'column', justifyContent:'space-evenly'}}>
            <StyledButton pending={true} onPress={() => {handleRegAction(item._id,'Pending')}}>
                <ButtonText> <MaterialIcons name='pending-actions' size={18}  color={primary} /> </ButtonText>
            </StyledButton>
            <StyledButton reject={true} onPress={() => {handleRegAction(item._id,'Reject')}}>
                <ButtonText> <Entypo name='cross' size={18}  color={primary} /> </ButtonText>
            </StyledButton>
        </View>}

        { item.status == 'Reject' && <View style={{ width: '20%',flexDirection: 'column', justifyContent:'space-evenly'}}>
            <StyledButton approved={true} onPress={() => {handleRegAction(item._id,'Approved')}}>
                <ButtonText> <Entypo name='check' size={18}  color={primary} /> </ButtonText>
            </StyledButton>
            <StyledButton pending={true} onPress={() => {handleRegAction(item._id,'Pending')}}>
                <ButtonText> <MaterialIcons name='pending-actions' size={18}  color={primary} /> </ButtonText>
            </StyledButton>
        </View>}

        

    </View>    
);

const MyTextInput = ({ label, ...props}) =>{
    return(
        <View>
            <StyledInputLabel {...props} >{label}</StyledInputLabel>
            <StyledTextInput {...props} />
        </View>
    )
}

const MyTextInputSearch = ({ label, icon, setVisible,  ...props}) =>{
    return(
        <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between'
        }}>
            <View style={{
                width: '100%',
                height: 50,
                flexDirection: 'row',
            }}>
                <LeftIcon product={true} >
                    <Octicons name={icon} size={30}  color={brand}  />
                </LeftIcon>
                <StyledTextInput {...props} />
            </View>
        </View>
    )
}



export default RegistrationListScreen
