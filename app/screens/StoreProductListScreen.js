import React, { useState, useEffect } from "react";
import {
  View,
  FlatList,
  Modal,
  ActivityIndicator,
  Text,
  Image,
  ImageBackground
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { StatusBar } from "expo-status-bar";
import { Formik } from "formik";
import * as FileSystem from 'expo-file-system';

import { Octicons, Entypo } from "@expo/vector-icons";

import {
  Colors,
  StyledContainer,
  InnerContainer,
  PageTitle,
  StyledFormArea,
  LeftIcon,
  MsgBox,
  ProductContainer,
  StyledTextInput,
  StyledButton,
  ButtonText,
  OuterdModalView,
  InnerModalView,
  StyledInputLabel,
  DashboardContainer,
  ExtraText,
} from "../components/styles";

import axios from "axios";
axios.defaults.baseURL = "https://oro-easyway.onrender.com/api/v1";
// axios.defaults.baseURL = 'http://192.168.4.148:8080/api/v1';

const { primary, brand, darkLight, green, tertiary, red } = Colors;

const StoreProductListScreen = ({ navigation, route }) => {
  const { storeName, data } = route.params;
  const { _id } = data;
  const [message, setMessage] = useState();
  const [messageType, setMessageType] = useState();
  const [messageModal, setMessageModal] = useState("");
  const [messageTypeModal, setMessageTypeModal] = useState();
  const [visible, setVisible] = useState(false);
  const [visibleUpdate, setVisibleUpdate] = useState(false);
  const [oldProductData, setOldProductData] = useState([]);
  const [productData, setProductData] = useState([]);
  const [product, setProduct] = useState(null);
  const [ind, setInd] = useState(0);
  const [image, setImage] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);


  const getStoreProducts = async () => {
    handleMessage("Loading...", "Default");
    await axios
      .get(`/products/store/${data._id}`)
      .then((response) => {
        const result = response.data;
        const { message, status, data } = result;
        // console.log("Get Products Result", data);

        if (status !== "SUCCESS") {
          handleMessage(message, status);
        } else {
          if (data.length < 1) {
            setProductData(data);
            setOldProductData(data);
            handleMessage("There is no product's yet.");
          } else {
            setProductData(data);
            setOldProductData(data);
            handleMessage("");
          }
        }
        setIsDeleting(false);
      })
      .catch((error) => {
        console.log(error.message);
        handleMessage("An error occured. Check your network and try again!");
        setIsDeleting(false);
      });
  };

  const handleAddProduct = async (data, setSubmitting) => {
    let wiData = null;
    if(image !== null){
        const base64 = await FileSystem.readAsStringAsync(image, { encoding: 'base64' });
        wiData = { ...data, image: base64 };
    }else{
        wiData = { ...data, image };
    }

    await axios
      .post("/products", wiData)
      .then((response) => {
        const result = response.data;
        const { message, status, data } = result;
        console.log("Add Products Result", data.length);

        if (status !== "SUCCESS") {
          handleMessageModal(message);
        } else {
          setVisible(!visible);
          setMessageModal("");
          handleMessage(message, status);
          getStoreProducts();
        }
        setImage(null);
        setSubmitting(false);
      })
      .catch((error) => {
        console.log(error.message);
        handleMessageModal(
          "An error occured. Check your network and try again!"
        );
        setImage(null);
        setSubmitting(false);
      });
  };

  const handleUpdateProduct = async (data, setSubmitting) => {
    let wiData = null;
    if(image != null){
        const base64 = await FileSystem.readAsStringAsync(image, { encoding: 'base64' });
        wiData = { ...data, image: base64 };
    }else{
        wiData = { ...data, image: product.image };
    }

    await axios
      .patch(`/products/${data._id}`, wiData)
      .then((response) => {
        const result = response.data;
        const { message, status, data } = result;
        console.log("Update Products Result", result);

        if (status !== "SUCCESS") {
          handleMessageModal(message);
        } else {
          // setVisibleUpdate(!visibleUpdate)
          handleMessageModal(message, status);
          getStoreProducts();
        }
        setSubmitting(false);
      })
      .catch((error) => {
        console.log(error.message);
        handleMessageModal(
          "An error occured. Check your network and try again!"
        );
        setSubmitting(false);
      });
  };

  const handleDeleteProduct = async (data, setIsDeleting) => {
    setIsDeleting(true)
    await axios
      .delete(`/products/${data._id}`)
      .then((response) => {
        const result = response.data;
        const { message, status, data } = result;
        console.log("Delete Products Result", result);

        if (status !== "SUCCESS") {
          handleMessageModal(message);
        } else {
          // setVisibleUpdate(!visibleUpdate)
          handleMessageModal(message, status);
          getStoreProducts();
        }
        
      })
      .catch((error) => {
        console.log(error.message);
        handleMessageModal(
          "An error occured. Check your network and try again!"
        );
        setIsDeleting(false);
      });
  };

  const pickImage = async () => {
    // Ask the user for the permission to access the camera
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("You've refused to allow this appp to access your media library!");
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    // console.log(result);

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const takeImage = async () => {
    // Ask the user for the permission to access the camera
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("You've refused to allow this appp to access your camera!");
      return;
    }

    const result = await ImagePicker.launchCameraAsync();

    console.log(result);

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const searchProduct = (text) => {
    if (text == "") {
      setProductData(oldProductData);
    } else {
      let tempList = productData.filter((item) => {
        return item.name.toLowerCase().indexOf(text.toLowerCase()) > -1;
      });

      setProductData(tempList);
    }
  };

  useEffect(() => {
    getStoreProducts();
  }, []);

  const handleMessage = (message, type = "FAILED") => {
    setMessage(message);
    setMessageType(type);
  };

  const handleMessageModal = (message, type = "FAILED") => {
    setMessageModal(message);
    setMessageTypeModal(type);
  };

  return (
    <StyledContainer dashbaord={true}>
      <StatusBar style="dark" />
      {/* <Avatar resizeMode="contain" source={require('./../assets/logo.png')}/> */}
      <InnerContainer>
        <ProductContainer>
          <PageTitle>Product's List</PageTitle>
          <StyledFormArea>
            <MyTextInputSearch
              product={true}
              icon="search"
              setVisible={setVisible}
              onChangeText={(text) => searchProduct(text)}
              setImage={setImage}
            />
            <MsgBox type={messageType} product={true}>
              {message}
            </MsgBox>
          </StyledFormArea>

          {isDeleting && <ExtraText><ActivityIndicator size="large" color={tertiary} /></ExtraText>}

          {!isDeleting && <FlatList
            data={productData}
            showsVerticalScrollIndicator={false}
            initialScrollIndex={ind}
            renderItem={({ item, index }) => (
              <Item
                item={item}
                index={index}
                data={data}
                setVisible={setVisibleUpdate}
                setProduct={setProduct}
                setImage={setImage}
                handleDeleteProduct={handleDeleteProduct}
                setIsDeleting={setIsDeleting}
              />
            )}
            keyExtractor={(item) => item._id}
            contentContainerStyle={{ paddingBottom: 50 }}
            style={{ width: "85%" }}
          />}

          {/* Add New Product */}
          <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={() => {
              setVisible(!visible);
              setMessageModal("");
            }}
          >
            <OuterdModalView>
              <InnerModalView>
                <PageTitle>Add Product</PageTitle>
                <MsgBox type={messageTypeModal} productModal={true}>
                  {messageModal}
                </MsgBox>
                <Formik
                  initialValues={{
                    name: "",
                    description: "",
                    price: "",
                    quantity: "",
                  }}
                  enableReinitialize
                  onSubmit={(values, { setSubmitting, resetForm }) => {
                    console.log(values);
                    if (
                      values.name == "" ||
                      values.description == "" ||
                      values.price == "" ||
                      values.quantity == ""
                    ) {
                      handleMessageModal(`Please don't leave a blank!`);
                      setSubmitting(false);
                    } else {
                      const prodData = { ...values, _id };
                      console.log("Prod data", prodData);
                      handleAddProduct(prodData, setSubmitting);
                    }
                  }}
                >
                  {({
                    handleChange,
                    handleBlur,
                    handleSubmit,
                    values,
                    isSubmitting,
                  }) => (
                    <StyledFormArea product={true}>
                      <MyTextInput
                        storeProfile={true}
                        label="Product Name"
                        onChangeText={handleChange("name")}
                        value={values.name}
                      />
                      <MyTextInput
                        storeProfile={true}
                        label="Description"
                        onChangeText={handleChange("description")}
                        value={values.description}
                      />
                      <MyTextInput
                        storeProfile={true}
                        label="Price"
                        onChangeText={handleChange("price")}
                        value={values.price}
                      />
                      <MyTextInput
                        storeProfile={true}
                        label="Quantity"
                        onChangeText={handleChange("quantity")}
                        value={values.quantity}
                      />

                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "center",
                          gap: 5,
                        }}
                      >
                        <View>
                          <StyledButton pickImg={true} onPress={pickImage}>
                            <LeftIcon pickImg={true}>
                              <Octicons
                                name="image"
                                size={14}
                                color={primary}
                              />
                            </LeftIcon>
                            <ButtonText pickImg={true}>
                              Pick an image
                            </ButtonText>
                          </StyledButton>
                        </View>
                        <View>
                          <StyledButton pickImg={true} onPress={takeImage}>
                            <LeftIcon pickImg={true}>
                              <Entypo name="camera" size={14} color={primary} />
                            </LeftIcon>
                            <ButtonText pickImg={true}>Take a photo</ButtonText>
                          </StyledButton>
                        </View>
                      </View>

                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "center",
                          margin: 15,
                        }}
                      >
                        {image != null && (
                          <Image
                            source={{ uri: image }}
                            style={{ width: 80, height: 80 }}
                          />
                        )}
                      </View>

                      {!isSubmitting && (
                        <StyledButton addproduct={true} onPress={handleSubmit}>
                          <ButtonText addproduct={true}>SUBMIT</ButtonText>
                        </StyledButton>
                      )}
                      {isSubmitting && (
                        <StyledButton addproduct={true} disabled={true}>
                          <ActivityIndicator size="small" color={primary} />
                        </StyledButton>
                      )}
                    </StyledFormArea>
                  )}
                </Formik>
              </InnerModalView>
            </OuterdModalView>
          </Modal>

          {/* Update Product Modal */}
          <Modal
            animationType="slide"
            transparent={true}
            visible={visibleUpdate}
            onRequestClose={() => {
              setVisibleUpdate(!visibleUpdate);
              setMessageModal("");
            }}
          >
            <OuterdModalView>
              <InnerModalView>
                <PageTitle>Update Product</PageTitle>
                <MsgBox type={messageTypeModal} productModal={true}>
                  {messageModal}
                </MsgBox>
                <Formik
                  initialValues={
                    product || {
                      name: "",
                      description: "",
                      price: "",
                      quantity: { $numberDecimal: "" },
                    }
                  }
                  enableReinitialize
                  onSubmit={(values, { setSubmitting, resetForm }) => {
                    //console.log(values);
                    if (
                      values.name == "" ||
                      values.description == "" ||
                      values.price == "" ||
                      values.quantity.$numberDecimal == ""
                    ) {
                      handleMessageModal(`Please don't leave a blank!`);
                      setSubmitting(false);
                    } else {
                      const prodData = { ...values };
                      console.log("Prod data", prodData);
                      handleUpdateProduct(prodData, setSubmitting);
                    }
                  }}
                >
                  {({
                    handleChange,
                    handleBlur,
                    handleSubmit,
                    values,
                    isSubmitting,
                  }) => (
                    <StyledFormArea product={true}>
                      <MyTextInput
                        storeProfile={true}
                        label="Product Name"
                        onChangeText={handleChange("name")}
                        value={values.name.toUpperCase()}
                      />
                      <MyTextInput
                        storeProfile={true}
                        label="Description"
                        onChangeText={handleChange("description")}
                        value={values.description}
                      />
                      <MyTextInput
                        storeProfile={true}
                        label="Price"
                        onChangeText={handleChange("price")}
                        value={values.price}
                      />
                      <MyTextInput
                        storeProfile={true}
                        label="Quantity"
                        onChangeText={handleChange("quantity")}
                        value={values.quantity.$numberDecimal}
                      />

                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "center",
                          gap: 5,
                        }}
                      >
                        <View>
                          <StyledButton pickImg={true} onPress={pickImage}>
                            <LeftIcon pickImg={true}>
                              <Octicons
                                name="image"
                                size={14}
                                color={primary}
                              />
                            </LeftIcon>
                            <ButtonText pickImg={true}>
                              Pick an image
                            </ButtonText>
                          </StyledButton>
                        </View>
                        <View>
                          <StyledButton pickImg={true} onPress={takeImage}>
                            <LeftIcon pickImg={true}>
                              <Entypo name="camera" size={14} color={primary} />
                            </LeftIcon>
                            <ButtonText pickImg={true}>Take a photo</ButtonText>
                          </StyledButton>
                        </View>
                      </View>

                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "center",
                          margin: 15,
                        }}
                      >
                        {image == null && product.image != null && (
                          <Image
                            source={{ uri: `data:image/jpeg;base64,${product.image}`}}
                            style={{ width: 80, height: 80 }}
                          />
                        )}
                        {image != null && (
                          <Image
                            source={{ uri: image}}
                            style={{ width: 80, height: 80 }}
                          />
                        )}
                      </View>

                      {!isSubmitting && (
                        <StyledButton addproduct={true} onPress={handleSubmit}>
                          <ButtonText addproduct={true}>UPDATE</ButtonText>
                        </StyledButton>
                      )}
                      {isSubmitting && (
                        <StyledButton addproduct={true} disabled={true}>
                          <ActivityIndicator size="small" color={primary} />
                        </StyledButton>
                      )}
                    </StyledFormArea>
                  )}
                </Formik>
              </InnerModalView>
            </OuterdModalView>
          </Modal>
        </ProductContainer>
      </InnerContainer>
    </StyledContainer>
  );
};

const Item = ({ item, index, data, setVisible, setProduct, setImage, handleDeleteProduct, setIsDeleting }) => (
  <ImageBackground
    source={require("./../assets/list_background.jpg")}
    resizeMode="cover"
    style={{
      width: "100%",
      borderRadius: 5,
      borderWidth: 0.5,
      borderWidth: 3,
      borderColor: tertiary,
      alignSelf: "center",
      marginTop: 10,
      marginBottom: index == data.length - 1 ? 30 : 0,
      alignItems: "center",
      flexDirection: "row",
      paddingTop: 2,
      paddingBottom: 2,
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

    <View style={{ width: "60%" }}>
      <Text
        style={{
          fontSize: 20,
          fontWeight: "700",
          marginLeft: 10,
          color: primary,
        }}
      >
        {item.name.toUpperCase()}
      </Text>
      <Text
        style={{
          fontSize: 14,
          marginLeft: 10,
          marginBottom: 5,
          marginTop: 5,
          color: primary,
        }}
      >
        {item.description.substring(0, 50)}
      </Text>

      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Text
          style={{
            fontSize: 12,
            fontWeight: "600",
            marginLeft: 10,
            color: "yellow",
          }}
        >
          Price:{" "}
        </Text>
        <Text style={{ fontSize: 14, fontWeight: "600", color: "yellow" }}>
          ₱{item.price}
        </Text>

        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Text
            style={{
              fontSize: 12,
              fontWeight: "600",
              marginLeft: 10,
              color: item.quantity.$numberDecimal > 20 ? green : red,
            }}
          >
            Quantity:{" "}
          </Text>
          <Text
            style={{
              fontSize: 14,
              fontWeight: "600",
              color: item.quantity.$numberDecimal > 20 ? green : red,
            }}
          >
            {item.quantity.$numberDecimal}
          </Text>
        </View>
      </View>
    </View>

    <View style={{ width: '20%',flexDirection: 'column', justifyContent:'space-evenly'}}>
      <StyledButton
        edit={true}
        onPress={() => {
          setImage(null);
          setVisible(true);
          setProduct(item);
        }}
      >
        <ButtonText>
          {" "}
          <Entypo name="pencil" size={18} color={tertiary} />{" "}
        </ButtonText>
      </StyledButton>

      <StyledButton reject={true} onPress={() => {handleDeleteProduct(item, setIsDeleting)}}>
          <ButtonText> <Entypo name='trash' size={16}  color={primary} /> </ButtonText>
      </StyledButton>
    </View>
  </ImageBackground>
);

const MyTextInput = ({ label, ...props }) => {
  return (
    <View>
      <StyledInputLabel {...props}>{label}</StyledInputLabel>
      <StyledTextInput {...props} />
    </View>
  );
};

const MyTextInputSearch = ({ label, icon, setVisible, setImage, ...props }) => {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <View
        style={{
          width: "85%",
          height: 50,
          flexDirection: "row",
        }}
      >
        <LeftIcon product={true}>
          <Octicons name={icon} size={30} color={brand} />
        </LeftIcon>
        <StyledTextInput {...props} />
      </View>
      <StyledButton
        product={true}
        onPress={() => {
          setImage(null);
          setVisible(true);
        }}
      >
        <ButtonText>
          <Octicons name="plus" size={25} color={primary} />
        </ButtonText>
      </StyledButton>
    </View>
  );
};

export default StoreProductListScreen;
