import React, { useState, useEffect } from 'react'
import { View, FlatList, Text, Image, ImageBackground  } from "react-native"
import { StatusBar } from 'expo-status-bar'

import { Octicons, Entypo } from '@expo/vector-icons'

import { 
    Colors, StyledContainer, InnerContainer, PageTitle, StyledFormArea,  LeftIcon, MsgBox,  ProductContainer, StyledTextInput, StyledButton, ButtonText, OuterdModalView, InnerModalView, StyledInputLabel, ExtraText } from '../components/styles'

import axios from 'axios'
axios.defaults.baseURL = 'https://oro-easyway.onrender.com/api/v1';
// axios.defaults.baseURL = 'http://192.168.254.147:8080/api/v1';


const { primary, brand, darkLight, green, tertiary } = Colors;

const MaterialViewerScreen = ({navigation, route}) => {
    const {storeName, _id, prodData} = route.params
    const [visible, setVisible] = useState(false);
    const [oldProductData, setOldProductData] = useState([]);
    const [productData, setProductData] = useState([]);
    const [ind, setInd] = useState(0)

    // console.log(prodData)
  

  return (
    <StyledContainer dashbaord={true}>
        <StatusBar style='dark' />
        <InnerContainer>
            <ProductContainer>
                <PageTitle >{storeName.toUpperCase()}</PageTitle>

                <MyMaterialContainer 
                    name={prodData.name}
                    price={prodData.price}
                    image={prodData.image}
                    quantity={prodData.quantity.$numberDecimal}
                />

            </ProductContainer>
        </InnerContainer>
    </StyledContainer>
  )
}

const Item = ({item, index, data}) => (
    <ImageBackground
        source={require('./../assets/list_background.jpg')} 
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
            paddingTop: 10,
            paddingBottom: 10,
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

        <View style={{ width: '80%'}}>
            <Text style={{fontSize: 25,fontWeight: '800', marginLeft: 10, color:primary  }}>{item.name.toUpperCase()}</Text>
            <Text style={{fontSize: 16, marginLeft: 10, color:primary }}>{item.description.substring(0, 50)}</Text>

            <View style={{ flexDirection: 'row', alignItems: 'center'}}>
                <Text style={{fontSize: 20, fontWeight: '600', marginLeft: 10, color: 'yellow' }}>Price: </Text>
                <Text style={{fontSize: 20, fontWeight: '600', color: 'yellow' }}>₱{item.price}</Text>

                <View style={{ flexDirection: 'row', alignItems: 'center'}}>
                    <Text style={{fontSize: 20, fontWeight: '600', marginLeft: 20, color: green }}>Quantity: </Text>
                    <Text style={{fontSize: 20, fontWeight: '600', color: green }}>{item.quantity.$numberDecimal}</Text>
                </View>
            </View>

        </View>
        

    </ImageBackground>    
);


const MyMaterialContainer = ({ name, price, image, quantity,  ...props}) =>{
    return(
        <View style={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 10
        }}>
            {image == null  && (
            <Entypo
                name="tools"
                size={300}
                color={brand}
                style={{
                width: 300,
                height: 300,
                marginTop: 10,
                }}
            />
            )}

            {image != null && (
            <Image
                source={{ uri: `data:image/jpeg;base64,${image}` }}
                style={{ width: 300, height: 300, marginTop: 20 }}
            />
            )}

            <ExtraText mview={true}>{name.toUpperCase()}</ExtraText>
            <ExtraText mview={true}>Price: {price}</ExtraText>
            <ExtraText mview={true}>Quantity: {quantity}</ExtraText>
            
        </View>
    )
}



export default MaterialViewerScreen
