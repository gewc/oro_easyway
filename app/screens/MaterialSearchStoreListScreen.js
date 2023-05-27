import React, { useState, useEffect } from 'react'
import { View, FlatList, Modal, ActivityIndicator, Text, ImageBackground } from "react-native"
import { StatusBar } from 'expo-status-bar'
import { Formik } from 'formik'

import { Octicons, Entypo, MaterialIcons } from '@expo/vector-icons'

import { 
    Colors, StyledContainer, InnerContainer, PageTitle, StyledFormArea,  LeftIcon, MsgBox,  ProductContainer, StyledTextInput, StyledButton, ButtonText, ExtraView, ExtraText } from '../components/styles'

import axios from 'axios'
axios.defaults.baseURL = 'https://oro-easyway.onrender.com/api/v1';
// axios.defaults.baseURL = 'http://192.168.70.148:8080/api/v1';


const { primary, brand, darkLight, green, red, tertiary } = Colors;

const MaterialSearchStoreListScreen = ({navigation, route}) => {
    const {searchText, mapRegion, type} = route.params
    const [message, setMessage] = useState();
    const [messageType, setMessageType] = useState();
    const [oldProductData, setOldProductData] = useState([]);
    const [productData, setProductData] = useState([]);
    const [ind, setInd] = useState(0) 

    const getHardwareStoreByMaterial = async () => {
        handleMessage("Loading...", "Default")
        let location = JSON.stringify(mapRegion)
        await axios.get('/products/materialsearch/'+searchText+'/'+location)
          .then((response) => {
              const result = response.data;
              const { message, status, data } = result;
              console.log('Material Search Data',data)
  
              if(status !== "SUCCESS"){ // IF ERROR FROM SERVER
                  handleMessage(message, status)
                  console.log(status, message)
              } else {
                if(data.length < 1){
                    //setProductData(data)
                    //setOldProductData(data)
                    handleMessage("There is no store yet.")
                }else{
                    //setProductData(data)
                    //setOldProductData(data)
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



    useEffect(() => {
        getHardwareStoreByMaterial();
    }, [])



  return (
    <StyledContainer dashbaord={true}>
        <StatusBar style='dark' />
        {/* <Avatar resizeMode="contain" source={require('./../assets/logo.png')}/> */}
        <InnerContainer>
            <ProductContainer>
                <PageTitle> Material Search </PageTitle>
                <StyledFormArea>
                    <ExtraView>
                        <ExtraText search={true}>Search Key: {searchText}</ExtraText>
                    </ExtraView>
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
            marginTop: 10,
            marginBottom: index == data.length - 1 ? 30 : 0,
            alignItems: 'center',
            flexDirection: 'row',
            paddingTop: 10,
            paddingBottom: 10,
            gap: 2
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
        <View style={{ width: '20%' }}>
            <StyledButton viewLoc={true} onPress={() => {navigation.navigate('MaterialSearchMapScreen', {searchText, mapRegion, type: 'material'})}}>
                <ButtonText> <Entypo name='location' size={20}  color={primary} /> </ButtonText>
            </StyledButton>
        </View>

        

    </ImageBackground>    
);

export default MaterialSearchStoreListScreen
