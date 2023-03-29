import React, { useState, useEffect } from 'react'
import { View, FlatList, Modal, ActivityIndicator, Text, ImageBackground } from "react-native"
import { StatusBar } from 'expo-status-bar'
import { Formik } from 'formik'

import { Octicons } from '@expo/vector-icons'

import { 
    Colors, StyledContainer, InnerContainer, PageTitle, StyledFormArea,  LeftIcon, MsgBox,  ProductContainer, StyledTextInput, StyledButton, ButtonText, OuterdModalView, InnerModalView, StyledInputLabel } from '../components/styles'

import axios from 'axios'
axios.defaults.baseURL = 'https://oro-easyway.onrender.com/api/v1';


const { primary, brand, darkLight, green } = Colors;

const StoreProductListScreen = ({navigation, route}) => {
    const {storeName, data} = route.params
    const {_id} = data
    const [message, setMessage] = useState();
    const [messageType, setMessageType] = useState();
    const [messageModal, setMessageModal] = useState('');
    const [messageTypeModal, setMessageTypeModal] = useState();
    const [visible, setVisible] = useState(false);
    const [oldProductData, setOldProductData] = useState([]);
    const [productData, setProductData] = useState([]);
    const [ind, setInd] = useState(0)

    const getStoreProducts = async () => {
        handleMessage("Loading...", "Default")
        await axios.get(`/products/store/${data._id}`)
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

    const handleAddProduct = async (data, setSubmitting) => {
        await axios.post('/products', data)
            .then((response) => {
                const result = response.data;
                const { message, status, data } = result;
                console.log("Add Products Result", data.length)

                if(status !== "SUCCESS"){
                    handleMessageModal(message)
                } else {
                    setVisible(!visible)
                    setMessageModal('')
                    handleMessage(message, status)
                    getStoreProducts();
                }
                setSubmitting(false)
            })
            .catch( error => {
                console.log(error.message)
                handleMessageModal("An error occured. Check your network and try again!")
                setSubmitting(false)
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
                <PageTitle >Product's List</PageTitle>
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
                    renderItem={({item, index}) => <Item item={item} index={index} data={data}/>}
                    keyExtractor={item => item._id}
                    contentContainerStyle={{ paddingBottom: 50 }}
                />

                <Modal
                    animationType='slide'
                    transparent={true}
                    visible={visible}
                    onRequestClose={() => {
                        setVisible(!visible)
                        setMessageModal('')
                    }}
                >
                    <OuterdModalView>
                        <InnerModalView>
                            <PageTitle>Add Product</PageTitle>
                            <MsgBox type={messageTypeModal} productModal={true}>{messageModal}</MsgBox>
                            <Formik
                                initialValues={{name: '', description: '', price: '', quantity: ''}}
                                enableReinitialize
                                onSubmit={(values,{setSubmitting, resetForm}) => {
                                    console.log(values);
                                    if(values.name == '' || values.description == '' || values.price == '' || values.quantity == ''){
                                        handleMessageModal(`Please don't leave a blank!`)
                                        setSubmitting(false)
                                    }else{
                                        const prodData = {...values,_id}
                                        console.log('Prod data', prodData)
                                        handleAddProduct(prodData, setSubmitting)
                                    }
                                    
                                }}
                            >
                                {({handleChange, handleBlur, handleSubmit, values, isSubmitting}) =>
                                <StyledFormArea product={true}>
                                    <MyTextInput
                                        storeProfile={true}
                                        label="Product Name"
                                        onChangeText={handleChange('name')}
                                        value={values.name}
                                    />
                                    <MyTextInput
                                        storeProfile={true}
                                        label="Description"
                                        onChangeText={handleChange('description')}
                                        value={values.description}
                                    />
                                    <MyTextInput
                                        storeProfile={true}
                                        label="Price"
                                        onChangeText={handleChange('price')}
                                        value={values.price}
                                    />
                                    <MyTextInput
                                        storeProfile={true}
                                        label="Quantity"
                                        onChangeText={handleChange('quantity')}
                                        value={values.quantity}
                                    />

                                    { !isSubmitting && <StyledButton onPress={handleSubmit}>
                                        <ButtonText>Submit</ButtonText>
                                    </StyledButton>}
                                    { isSubmitting && <StyledButton  disabled={true}>
                                        <ActivityIndicator size="large" color={primary}/>
                                    </StyledButton> }

                                </StyledFormArea>

                            }                               
                            </Formik>

                        </InnerModalView>
                    </OuterdModalView>
                </Modal>



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
                width: '85%',
                height: 50,
                flexDirection: 'row',
            }}>
                <LeftIcon product={true} >
                    <Octicons name={icon} size={30}  color={brand}  />
                </LeftIcon>
                <StyledTextInput {...props} />
            </View>
            <StyledButton product={true} onPress={() => setVisible(true)}>
                <ButtonText><Octicons name="plus" size={25}  color={primary} /></ButtonText>
            </StyledButton>
        </View>
    )
}



export default StoreProductListScreen
