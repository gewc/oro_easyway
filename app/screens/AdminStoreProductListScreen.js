import React, { useState, useEffect } from 'react'
import { View, FlatList, Modal, ActivityIndicator, Text, ImageBackground } from "react-native"
import { StatusBar } from 'expo-status-bar'
import { Formik } from 'formik'

import { Octicons, Entypo } from '@expo/vector-icons'

import { 
    Colors, StyledContainer, InnerContainer, PageTitle, StyledFormArea,  LeftIcon, MsgBox,  ProductContainer, StyledTextInput, StyledButton, ButtonText, OuterdModalView, InnerModalView, StyledInputLabel } from '../components/styles'

import axios from 'axios'
axios.defaults.baseURL = 'https://oro-easyway.onrender.com/api/v1';


const { primary, brand, darkLight, green, tertiary } = Colors;

const AdminStoreProductListScreen = ({navigation, route}) => {
    const {storeName, data} = route.params
    const {_id} = data
    const [message, setMessage] = useState();
    const [messageType, setMessageType] = useState();
    const [messageModal, setMessageModal] = useState('');
    const [messageTypeModal, setMessageTypeModal] = useState();
    const [visible, setVisible] = useState(false);
    const [visibleUpdate, setVisibleUpdate] = useState(false);
    const [oldProductData, setOldProductData] = useState([]);
    const [productData, setProductData] = useState([]);
    const [product, setProduct] = useState(null);
    const [ind, setInd] = useState(0)

    const getStoreProducts = async () => {
        handleMessage("Loading...", "Default")
        await axios.get(`/products/store/${data._id}`)
            .then((response) => {
                const result = response.data;
                const { message, status, data } = result;
                // console.log("Get Products Result", data)


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

    const handleUpdateProduct = async (data, setSubmitting) => {
        await axios.patch(`/products/${data._id}`, data)
            .then((response) => {
                const result = response.data;
                const { message, status, data } = result;
                console.log("Update Products Result", result)

                if(status !== "SUCCESS"){
                    handleMessageModal(message)
                } else {
                    // setVisibleUpdate(!visibleUpdate)
                    handleMessageModal(message, status)
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
                    renderItem={({item, index}) => 
                        <Item 
                            item={item} 
                            index={index} 
                            data={data}
                            setVisible = {setVisibleUpdate}
                            setProduct = {setProduct}
                        />}
                    keyExtractor={item => item._id}
                    contentContainerStyle={{ paddingBottom: 50 }}
                />

                {/* Add New Product */}
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
                
                {/* Update Product Modal */}
                <Modal
                    animationType='slide'
                    transparent={true}
                    visible={visibleUpdate}
                    onRequestClose={() => {
                        setVisibleUpdate(!visibleUpdate)
                        setMessageModal('')
                    }}
                >
                    <OuterdModalView>
                        <InnerModalView>
                            <PageTitle>Update Product</PageTitle>
                            <MsgBox type={messageTypeModal} productModal={true}>{messageModal}</MsgBox>
                            <Formik
                                initialValues={product || {name: '', description: '', price:  '', quantity: {$numberDecimal: ''}}}
                                enableReinitialize
                                onSubmit={(values,{setSubmitting, resetForm}) => {
                                    //console.log(values);
                                    if(values.name == '' || values.description == '' || values.price == '' || values.quantity.$numberDecimal == ''){
                                        handleMessageModal(`Please don't leave a blank!`)
                                        setSubmitting(false)
                                    }else{
                                        const prodData = {...values}
                                        console.log('Prod data', prodData)
                                        handleUpdateProduct(prodData, setSubmitting)
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
                                        value={values.quantity.$numberDecimal}
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

const Item = ({item, index, data, setVisible, setProduct}) => (
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
            paddingTop: 5,
            paddingBottom: 5,
        }}
    >
        
        <Entypo name='tools' size={40}  color={primary}  
            style={{
                width: 45,
                height: 45,
                marginLeft:10
            }} />
        <View style={{ width: '60%'}}>
            <Text style={{fontSize: 20,fontWeight: '700', marginLeft: 10, color:primary  }} adjustsFontSizeToFit={true} numberOfLines={1}>{item.name.toUpperCase()}</Text>
            <Text style={{fontSize: 16, marginLeft: 10, color:primary }}>{item.description.substring(0, 50)}</Text>

            <View style={{ flexDirection: 'row', alignItems: 'center'}}>
                <Text style={{fontSize: 16, fontWeight: '600', marginLeft: 10, color: 'yellow' }}>Price: </Text>
                <Text style={{fontSize: 16, fontWeight: '600', color: 'yellow' }}>₱{item.price}</Text>

                <View style={{ flexDirection: 'row', alignItems: 'center'}}>
                    <Text style={{fontSize: 16, fontWeight: '600', marginLeft: 20, color: green }}>Quantity: </Text>
                    <Text style={{fontSize: 16, fontWeight: '600', color: green }}>{item.quantity.$numberDecimal}</Text>
                </View>
            </View>

        </View>

        <View style={{ width: '20%'}}>
            <StyledButton edit={true} onPress={() => {
                setVisible(true)
                setProduct(item)
            }}>
                <ButtonText> <Entypo name='pencil' size={20}  color={tertiary} /> </ButtonText>
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



export default AdminStoreProductListScreen
