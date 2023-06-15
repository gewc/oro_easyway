import React, { useState, useEffect } from 'react'
import { View, FlatList, Modal, ActivityIndicator, Text, Image, ImageBackground } from "react-native"
import { StatusBar } from 'expo-status-bar'
import { Formik } from 'formik'
import * as Device from 'expo-device';
import * as Location from 'expo-location';

import { Octicons, Entypo, MaterialIcons } from '@expo/vector-icons'

import { 
    Colors, StyledContainer, InnerContainer, PageTitle, StyledFormArea,  LeftIcon, MsgBox,  ProductContainer, DashboardContainer, StyledButton, ButtonText, ExtraView, ExtraText } from '../components/styles'

import axios from 'axios'
axios.defaults.baseURL = 'https://oro-easyway.onrender.com/api/v1';
//axios.defaults.baseURL = 'http://192.168.70.148:8080/api/v1';


const { primary, brand, darkLight, green, red, tertiary } = Colors;

const MaterialSearchStoreListScreen = ({navigation, route}) => {
    const {searchText, mapRegion, type} = route.params
    const [message, setMessage] = useState();
    const [messageType, setMessageType] = useState();
    const [oldProductData, setOldProductData] = useState([]);
    const [productData, setProductData] = useState([]);
    const [ind, setInd] = useState(0) 
    const [loading, setLoading] = useState(false)

    const getHardwareStoreByMaterial = async () => {
        handleMessage("Loading...", "Default")
        let location = JSON.stringify(mapRegion)
        await axios.get('/products/materialsearch/'+searchText+'/'+location)
          .then((response) => {
              const result = response.data;
              const { message, status, data } = result;
            //   console.log('Material Search Data',data)
  
              if(status !== "SUCCESS"){ // IF ERROR FROM SERVER
                  handleMessage(message, status)
                  console.log(status, message)
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
              console.log(error.message)
              handleMessage("An error occured. Check your network and try again!")
          });
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

    const handleViewPress = async (storeId, prodId, mapRegion, sData, prodData) => {
        const deviceId = Device.osInternalBuildId
        const {longitude, latitude} = mapRegion
        let address = await Location.reverseGeocodeAsync({
          longitude,
          latitude,
        });

        setLoading(true)
        
        await axios.post('/views/',{storeId, prodId, deviceId, address})
          .then((response) => {
              const result = response.data;
              const { message, status, data } = result;
              console.log('View Store Data',result)
              setLoading(false)
          })
          .catch( error => {
              console.log('View Store Data',error.message)
              setLoading(false)
          });
  
          navigation.navigate('MaterialSearchMapScreen', {searchText: '', mapRegion, type: 'material', sData, prodData})
  
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
                
                { loading && <>
                    <ActivityIndicator size="large" color="#000"/>
                    <ButtonText mapLoading={true}>Fetching store location... </ButtonText>
                    </>
                }

                {!loading && <FlatList 
                    data={productData}
                    showsVerticalScrollIndicator={false}
                    initialScrollIndex={ind}
                    renderItem={({item, index}) => 
                        <Item 
                            item={item} 
                            index={index} 
                            data={productData} 
                            mapRegion={mapRegion}
                            convertDateToString={convertDateToString}
                            navigation={navigation}
                            handleViewPress={handleViewPress}
                        />}
                    keyExtractor={item => item._id}
                    contentContainerStyle={{ paddingBottom: 50 }}
                    
                />}


            </ProductContainer>
        </InnerContainer>
    </StyledContainer>
  )
}

const Item = ({item, index, data, mapRegion, navigation, handleViewPress}) => (
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

        <View style={{ width: '60%'}}>
            <Text style={{fontSize: 18,fontWeight: '800', marginLeft: 10, color:primary  }} adjustsFontSizeToFit={true} numberOfLines={1}>{item.name.toUpperCase()}</Text>
            
            <View style={{ flexDirection: 'row', alignItems: 'center'}}>
                <Text style={{fontSize: 16, fontWeight: '600', marginLeft: 10, color: 'yellow' }}>Price: </Text>
                <Text style={{fontSize: 16, fontWeight: '600', color: 'yellow' }}>₱{item.price}</Text>

                <View style={{ flexDirection: 'row', alignItems: 'center'}}>
                    <Text style={{fontSize: 16, fontWeight: '600', marginLeft: 20, color: item.quantity.$numberDecimal > 20 ? green : red  }}>Quantity: </Text>
                    <Text style={{fontSize: 16, fontWeight: '600', color: item.quantity.$numberDecimal > 20 ? green : red }}>{item.quantity.$numberDecimal}</Text>
                </View>
            </View>

            <Text style={{fontSize: 14, fontWeight: '600', marginLeft: 10, marginTop: 7, color:darkLight }}>{item.storeData[0]?.name.toUpperCase()}</Text>
            <Text style={{fontSize: 9, marginLeft: 10, color:primary }}>{item.storeData[0]?.address}</Text>
        </View>
        <View style={{ width: '20%' }}>
            <StyledButton viewLoc={true} onPress={() => {handleViewPress(item.storeData[0]._id, item._id, mapRegion , item.storeData[0], item)}}>
                <ButtonText> <Entypo name='location' size={20}  color={primary} /> </ButtonText>
            </StyledButton>
        </View>

        

    </ImageBackground>    
);

export default MaterialSearchStoreListScreen
