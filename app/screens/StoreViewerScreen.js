import React, { useState, useEffect } from 'react'
import { View, FlatList, Modal, ActivityIndicator, Text, ImageBackground } from "react-native"
import { StatusBar } from 'expo-status-bar'
import { Formik } from 'formik'

import { Octicons } from '@expo/vector-icons'

import { 
    Colors, StyledContainer, InnerContainer, PageTitle, StyledFormArea,  LeftIcon, MsgBox,  ProductContainer, StyledTextInput, StyledButton, ButtonText, OuterdModalView, InnerModalView, StyledInputLabel } from '../components/styles'

import axios from 'axios'
// axios.defaults.baseURL = 'https://oro-easyway.onrender.com/api/v1';
axios.defaults.baseURL = 'http://192.168.254.147:8080/api/v1';


const { primary, brand, darkLight, green } = Colors;

const StoreViewerScreen = ({navigation, route}) => {
    const {storeName, _id} = route.params
    const [message, setMessage] = useState();
    const [messageType, setMessageType] = useState();
    const [messageModal, setMessageModal] = useState('');
    const [messageTypeModal, setMessageTypeModal] = useState();
    const [visible, setVisible] = useState(false);
    const [oldProductData, setOldProductData] = useState([]);
    const [productData, setProductData] = useState([]);
    const [ind, setInd] = useState(0)

    const getStoreProducts = async () => {
        console.log(_id)
        handleMessage("Loading...", "Default")
        await axios.get(`/products/store/${_id}`)
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
                        handleMessage("There is no product's yet.")
                    }else{
                        setProductData(data)
                        setOldProductData(data)
                        handleMessage("")
                    }
                    
                }
            })
            .catch( error => {
                console.log(error.message)
                handleMessage("An error occured. Check your network and try again!")
            });
    }

    const searchProduct = (text) => {
        if(text == ''){
            setProductData(oldProductData);
        }else{
            let tempList = productData.filter((item) => {
                return item.name.toLowerCase().indexOf(text.toLowerCase()) > -1
            })
    
            setProductData(tempList);
        }
        
        
    }

    useEffect(() => {
        getStoreProducts();
    }, [])

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
        {/* <Avatar resizeMode="contain" source={require('./../assets/logo.png')}/> */}
        <InnerContainer>
            <ProductContainer>
                <PageTitle >{storeName.toUpperCase()}</PageTitle>
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
                    renderItem={({item, index}) => <Item item={item} index={index} data={productData}/>}
                    keyExtractor={item => item._id}
                    contentContainerStyle={{ paddingBottom: 50 }}
                />

            </ProductContainer>
        </InnerContainer>
    </StyledContainer>
  )
}

const Item = ({item, index, data}) => (
    <View
        style={{
            width: '95%',
            borderRadius: 5,
            borderWidth: 0.5,
            borderWidth: 3,
            borderColor: 'black',
            backgroundColor: brand,
            alignSelf: 'center',
            marginTop: 15,
            marginBottom: index == data.length - 1 ? 30 : 0,
            alignItems: 'center',
            flexDirection: 'row',
            elevation: 2
        }}
    >
        
        <Octicons name='tools' size={60}  color={primary}  
            style={{
                width: 60,
                height: 60,
                marginLeft:15
            }} />
        <View style={{ width: '80%'}}>
            <Text style={{fontSize: 25,fontWeight: '800', marginLeft: 10, marginTop: 10, color:primary  }}>{item.name.toUpperCase()}</Text>
            <Text style={{fontSize: 16,margin: 10, color:primary }}>{item.description.substring(0, 50)}</Text>

            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10}}>
                <Text style={{fontSize: 20, fontWeight: '600', marginLeft: 10, color: 'yellow' }}>Price: </Text>
                <Text style={{fontSize: 20, fontWeight: '600', color: 'yellow' }}>₱{item.price.$numberDecimal}</Text>

                <View style={{ flexDirection: 'row', alignItems: 'center'}}>
                    <Text style={{fontSize: 20, fontWeight: '600', marginLeft: 20, color: green }}>Quantity: </Text>
                    <Text style={{fontSize: 20, fontWeight: '600', color: green }}>{item.quantity.$numberDecimal}</Text>
                </View>
            </View>

        </View>
        

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



export default StoreViewerScreen
