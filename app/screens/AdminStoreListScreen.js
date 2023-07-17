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

const AdminStoreListScreen = ({navigation, route}) => {
    const { data } = route.params
    const [message, setMessage] = useState();
    const [messageType, setMessageType] = useState();
    const [messageModal, setMessageModal] = useState('');
    const [messageTypeModal, setMessageTypeModal] = useState();
    const [visible, setVisible] = useState(false);
    const [oldProductData, setOldProductData] = useState([]);
    const [productData, setProductData] = useState([]);
    const [ind, setInd] = useState(0)

    const getStores = async () => {
        handleMessage("Loading...", "Default")
        await axios.get(`/stores`)
            .then((response) => {
                const result = response.data;
                const { message, status, data } = result;
                console.log("Get Products Result", data)


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
        getStores();
    }, [])



  return (
    <StyledContainer dashbaord={true}>
        <StatusBar style='dark' />
        {/* <Avatar resizeMode="contain" source={require('./../assets/logo.png')}/> */}
        <InnerContainer>
            <ProductContainer>
                <PageTitle >Hardware Store's</PageTitle>
                <StyledFormArea>
                    <MyTextInputSearch 
                        product={true}
                        icon="search"
                        navigation={navigation}
                        onChangeText={text => searchProduct(text)}
                        data={data}
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
                            navigation={navigation}
                        />}
                    keyExtractor={item => item._id}
                    contentContainerStyle={{ paddingBottom: 50 }}
                    
                />


            </ProductContainer>
        </InnerContainer>
    </StyledContainer>
  )
}

const Item = ({item, index, data, navigation}) => (
    <ImageBackground
        source={require('./../assets/bg.png')} 
        resizeMode="cover"
        style={{
            width: '100%',
            borderRadius: 5,
            borderWidth: 0.5,
            borderWidth: 3,
            borderColor: darkLight,
            alignSelf: 'center',
            marginTop: 15,
            marginBottom: index == data.length - 1 ? 30 : 0,
            alignItems: 'center',
            flexDirection: 'row',
            paddingTop: 10,
            paddingBottom: 10,
        }}
    >
        
        <Entypo name='tools' size={40}  color={primary}  
            style={{
                width: 40,
                height: 40,
                marginLeft:10
            }} />
        <View style={{ width: '60%'}}>
            <Text style={{fontSize: 18,fontWeight: '800', marginLeft: 10, color:primary  }} adjustsFontSizeToFit={true} numberOfLines={1}>{item.name.toUpperCase()}</Text>
            <Text style={{fontSize: 14,marginLeft: 10, color:primary }} adjustsFontSizeToFit={true} numberOfLines={1}>{item.address.substring(0, 50)}</Text>
            <Text style={{fontSize: 14,marginLeft: 10, color:primary }}>{item.email.substring(0, 50)}</Text>
        </View>
        <View style={{ width: '20%'}}>
            <StyledButton view={true} onPress={() => {navigation.navigate('AdminStoreProfileScreen', {storeData: item})}}>
                <ButtonText> <Entypo name='eye' size={20}  color={primary} /> </ButtonText>
            </StyledButton>
        </View>

        

    </ImageBackground>    
);

const MyTextInput = ({ label, ...props}) =>{
    return(
        <View>
            <StyledInputLabel {...props} >{label}</StyledInputLabel>
            <StyledTextInput {...props} />
        </View>
    )
}

const MyTextInputSearch = ({ label, icon, navigation, data,  ...props}) =>{
    return(
        <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between'
        }}>
            <View style={{
                width: '90%',
                height: 50,
                flexDirection: 'row',
            }}>
                <LeftIcon product={true} >
                    <Octicons name={icon} size={30}  color={brand}  />
                </LeftIcon>
                <StyledTextInput {...props} />
            </View>
            {/* <StyledButton product={true} onPress={() => {navigation.navigate('AdminAddStoreDetailsScreen',{data,locDetails: null, location: null})}}>
                <ButtonText><Octicons name="plus" size={22}  color={primary} /></ButtonText>
            </StyledButton> */}
        </View>
    )
}



export default AdminStoreListScreen
