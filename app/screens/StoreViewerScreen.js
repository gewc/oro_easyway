import React, { useState, useEffect } from 'react'
import { View, FlatList, Text, Image, ImageBackground  } from "react-native"
import { StatusBar } from 'expo-status-bar'

import { Octicons, Entypo } from '@expo/vector-icons'
import { useIsFocused } from '@react-navigation/native';

import { 
    Colors, StyledContainer, InnerContainer, PageTitle, StyledFormArea, NotifiText, LeftIcon, MsgBox,  ProductContainer, StyledTextInput, StyledButton, ButtonText, OuterdModalView, InnerModalView, StyledInputLabel } from '../components/styles'

import axios from 'axios'
axios.defaults.baseURL = 'https://oro-easyway.onrender.com/api/v1';
// axios.defaults.baseURL = 'http://192.168.254.147:8080/api/v1';


const { primary, brand, darkLight, green, tertiary } = Colors;

const StoreViewerScreen = ({navigation, route}) => {
    const { storeName, data } = route.params;
    const { _id, name } = data;
    const [message, setMessage] = useState();
    const [messageType, setMessageType] = useState();
    const [messageModal, setMessageModal] = useState('');
    const [messageTypeModal, setMessageTypeModal] = useState();
    const [visible, setVisible] = useState(false);
    const [oldProductData, setOldProductData] = useState([]);
    const [productData, setProductData] = useState([]);
    const [countD, setCountD] = useState(null);
    const [ind, setInd] = useState(0)

    const getStoreProducts = async () => {
        // console.log(_id)
        handleMessage("Loading...", "Default")
        await axios.get(`/views/product/${_id}`)
            .then((response) => {
                const result = response.data;
                const { message, status, data } = result;
                // console.log("Get Products Result", data)
                const { pdata, countD } = data;
                // console.log("Get Products Result", data)
                setCountD(countD)


                if(status !== "SUCCESS"){
                    handleMessage(message, status)
                } else {
                    if(pdata.length < 1){
                        setProductData(pdata)
                        setOldProductData(pdata)
                        handleMessage("There is no views of your product's.")
                    }else{
                        setProductData(pdata)
                        setOldProductData(pdata)
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

    const isFocused = useIsFocused();
    useEffect(() => {
        if(isFocused){
            getStoreProducts();
        }
    }, [isFocused])

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
                <PageTitle >Product View's</PageTitle>
                <StyledFormArea>
                    
                    <MsgBox type={messageType} product={true}>{message}</MsgBox>

                </StyledFormArea>

                

                <FlatList 
                    data={productData}
                    showsVerticalScrollIndicator={false}
                    initialScrollIndex={ind}
                    renderItem={({item, index}) => <Item item={item} index={index} data={productData} storeId={_id} countD={countD} navigation={navigation} />}
                    keyExtractor={item => item._id}
                    contentContainerStyle={{ paddingBottom: 50 }}
                    style={{width: '90%'}}
                />

            </ProductContainer>
        </InnerContainer>
    </StyledContainer>
  )
}

const Item = ({item, index, data, storeId, countD, navigation}) => (
    <ImageBackground
        source={require('./../assets/bg.png')} 
        resizeMode="cover"
        style={{
            width: '100%',
            borderRadius: 5,
            borderWidth: 0.5,
            borderWidth: 3,
            borderColor: tertiary,
            alignSelf: 'center',
            marginTop: 10,
            marginBottom: index == data.length - 1 ? 30 : 0,
            alignItems: 'center',
            flexDirection: 'row',
            paddingTop: 5,
            paddingBottom: 5,
        }}
        
    >
        
        {item.image == null  && (
        <Entypo
            name="tools"
            size={40}
            color={primary}
            style={{
            width: 45,
            height: 45,
            marginLeft: 10,
            }}
        />
        )}

        {item.image != null && (
        <Image
            source={{ uri: `data:image/jpeg;base64,${item.image}` }}
            style={{ width: 45, height: 55, marginLeft: 10 }}
        />
        )}

        <View style={{ width: '63%'}}>
            <Text style={{fontSize: 20,fontWeight: '800', marginLeft: 10, color:primary  }} adjustsFontSizeToFit={true} numberOfLines={1}>{item.name.toUpperCase()}</Text>
            {/* <Text style={{fontSize: 16, marginLeft: 10, color:primary }}>{item.description.substring(0, 50)}</Text> */}

            <View style={{ flexDirection: 'row', alignItems: 'center'}}>
                <Text style={{fontSize: 16, fontWeight: '600', marginLeft: 10, color: 'yellow' }}>Price: </Text>
                <Text style={{fontSize: 16, fontWeight: '600', color: 'yellow' }}>₱{item.price}</Text>

                <View style={{ flexDirection: 'row', alignItems: 'center'}}>
                    <Text style={{fontSize: 16, fontWeight: '600', marginLeft: 20, color: green }}>Quantity: </Text>
                    <Text style={{fontSize: 16, fontWeight: '600', color: green }}>{item.quantity.$numberDecimal}</Text>
                </View>
            </View>
            

        </View>

        <View style={{ width: '17%'}}>
            <StyledButton view={true} onPress={() => { navigation.navigate('StoreProductViewerScreen', {pId: item._id, storeId}) }}>
                <ButtonText> <Entypo name='eye' size={20}  color={primary} /> </ButtonText>
            </StyledButton>
        </View>

        <NotifiText>{countD[item._id]}</NotifiText>
        

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
