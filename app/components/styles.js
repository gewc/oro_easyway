import styled from "styled-components";
import { View, Text, Image, TextInput, TouchableOpacity, ScrollView } from "react-native";
import Constants from "expo-constants";

const StatusBarHeight = Constants.statusBarHeight;

// colors themes
// colors themes
export const Colors ={
  primary: "#ffffff",
  secondary: "#e5e7eb",
  tertiary: "#1f2937",
  darkLight: "#9ca3af",
  brand: "#1434A4",
  green: "#10b981",
  red: "#ef4444",
};


const { primary, secondary, tertiary, darkLight, brand, green, red } = Colors;

export const StyledContainer = styled.View`
  flex: 1;
  padding: 25px;
  padding-top: ${StatusBarHeight + 30}px;
  ${(props) => props.dashbaord && `
    padding: 0px;
  `}
`

export const InnerContainer = styled.View`
  flex: 1;
  width: 100%;
  align-items: center;
  
  ${(props) => props.profile && `
    top: ${StatusBarHeight + 20 }px;
  `}
`

export const DashboardContainer = styled(InnerContainer)`
  padding: 25px;
  padding-top: 10px;
  justify-content: center;
`

export const ProductContainer = styled(InnerContainer)`
  padding: 0px;
  padding-top: 10px;
`

export const PageLogo = styled.Image`
  border-radius: 10px;
`

export const Avatar = styled.Image`
  width: 100px;
  height: 100px;
  margin: auto;
  border-radius: 50px;
  border-width: 2px;
  border-color: ${darkLight};
  margin-bottom: 10px;
  margin-top: 10px;


`

export const WelcomeImage = styled.Image`
  height: 50%;
  min-width: 100%;
`

export const PageTitle = styled.Text`
  font-size: 30px;
  text-align: center;
  font-weight: bold;
  color: ${brand};
  padding: 10px;
  margin-top: 10px;

  ${(props) => props.dashbaord && `
    font-size: 35px;
    color: ${primary};
  `}
`

export const SubTitle = styled.Text`
  font-size: 18px;
  font-weight: bold;
  color: ${tertiary};
  letter-spacing: 1px;
  margin-bottom: 20px;

  ${(props) => props.dashbaord && `
    margin-top: 5px;
    font-weight: normal;
  `}
  ${(props) => props.storeDetails && `
    font-size: 24px;
    margin-top: 5px;
    font-weight: 700;
    color: ${primary};

  `}
`

export const StyledFormArea = styled.View`
  width: 90%;

  ${(props) => props.product && `
    width: 100%;
  `}

`

export const StyledTextInput = styled.TextInput`
  background-color: ${secondary};
  padding: 15px;
  padding-left: 55px;
  padding-right: 55px;
  border-radius: 5px;
  font-size: 16px;
  height: 60px;
  margin-top: 15px;
  margin-bottom: 10px;
  color: ${tertiary};

  ${(props) => props.searchMaterial && `
    border-radius: 30px;
    font-size: 22px;
    
  `}

  ${(props) => props.product && `
    border-radius: 30px;
    font-size: 22px;
    margin-top: 0px;
    height: 100%;
    width: 100%;
    padding: 5px;
    padding-left: 55px;
    font-size: 14px;
    border: 1px solid ${brand}
  `}

  ${(props) => props.store && `
    background-color: transparent;
    border-bottom-color: ${primary};
    border-bottom-width: 1px;
    color: ${primary};
    font-size: 22px;
    text-align: center;
    border-radius: 1px;
  `}

  ${(props) => props.storeDetails && `
    background-color: transparent;
    font-size: 16px;
    color: ${primary};
    border-bottom-color: ${primary};
    border-bottom-width: 1px;
    border-radius: 1px;
    padding: 5px;
    padding-left: 15px;
    padding-right: 15px;
    height: 45px;
    margin-top: 5px;
  `}

  ${(props) => props.storeProfile && `
    background-color: transparent;
    border-bottom-color: ${brand};
    border-bottom-width: 1px;
    color: ${tertiary};
    font-size: 18px;
    text-align: left;
    border-radius: 1px;
    height: 45px;
    margin-top: 5px;
    margin-bottom: 10px;
    padding: 5px;
  `}
`

export const StyledInputLabel = styled.Text`
  color:${tertiary};
  font-size: 13px;
  text-align: left;

  ${(props) => props.store && `
    font-size: 16px;
    text-align: center;
    color: ${primary};
    margin-bottom: 15px;
  `}
  ${(props) => props.location && `
    font-size: 16px;
    text-align: center;
    color: ${primary};
    margin-bottom: 5px;
  `}

  ${(props) => props.storeDetails && `
    font-size: 16px;
    color: ${primary};
  `}

  ${(props) => props.storeProfile && `
    top: 10px
  `}

`

export const LeftIcon = styled.View`
  left: 15px;
  top: 30px;
  position: absolute;
  z-index: 1;

  ${(props) => props.product && `
    top: 8px;
  `}
  ${(props) => props.distance && `
    top: 0px;
    left: 0px;
  `}

`

export const RightIcon = styled.TouchableOpacity`
  right: 15px;
  top: 30px;
  position: absolute;
  z-index: 1;
`

export const StyledButton = styled.TouchableOpacity`
  padding: 15px;
  background-color: ${brand};
  justify-content: center;
  align-items: center;
  margin-top: 15px;
  height: 60px;
  border-radius: 30px;

  ${(props) => props.map == true && `
    position: absolute;
    bottom: 10px;
    align-self: center;
    background-color: ${brand};
    justify-content: center;
    width: 90%;
    margin-bottom: 15px;
    shadow-color: ${brand};
    elevation: 7;
  `}

  ${(props) => props.google == true && `
    background-color: ${green};
    flex-direction: row;
    justify-content: center;
  `}

  ${(props) => props.findMaterial == true && `
    background-color: transparent;
    flex-direction: row;
    justify-content: center;
    border-radius: 10px;
    border: 3px solid #fff;
    height: 70px;
  `}

  ${(props) => props.adminStoreProfile == true && `
    background-color: ${brand};
    flex-direction: row;
    justify-content: center;
    border-radius: 10px;
    border: 3px solid ${tertiary};
    height: 50px;
    padding: 10px;
    width: 150px;
  `}

  ${(props) => props.adminDash == true && `
    background-color: rgba(0,0,0,0.30);
    flex-direction: row;
    justify-content: center;
    border-top-left-radius: 0px;
    border-top-right-radius: 90px;
    border-bottom-left-radius: 90px;
    border-bottom-right-radius: 0px;
    border: 3px solid ${primary};
    height: 80px;
  `}

  ${(props) => props.btnSearch && `
    background-color: ${brand};
    flex-direction: row;
    justify-content: center;
    elevation: 2;
  `}

  ${(props) => props.store && `
    background-color: transparent;
    flex-direction: row;
    justify-content: center;
    border-radius: 30px;
    border: 3px solid #fff;
    height: 60px;
  `}

  ${(props) => props.product && `
    flex-direction: row;
    height: 50px;
    margin-top: 0px;
    border-radius: 10px;
  `}

  ${(props) => props.viewStore && `
    flex-direction: row;
    height: 90%;
    margin-top: 0px;
    border-radius: 10px;
  `}

  ${(props) => props.approved && `
    background-color: #116530;
    flex-direction: row;
    margin-top: 0px;
    border-radius: 60px;
    padding: 2px;
    height: 28px;
    border: 2px solid #2F5233;
    margin-top: 5px;
    margin-bottom: 5px;
  `}

  ${(props) => props.reject && `
    background-color: #E32227;
    flex-direction: row;
    margin-top: 0px;
    border-radius: 60px;
    padding: 2px;
    height: 28px;
    border: 2px solid #6D0E10;
    margin-top: 5px;
    margin-bottom: 5px;
  `}

  ${(props) => props.pending && `
    background-color: #828E7B;
    flex-direction: row;
    margin-top: 0px;
    border-radius: 60px;
    padding: 2px;
    height: 28px;
    border: 2px solid #555D50;
    margin-top: 5px;
    margin-bottom: 5px;
  `}

  ${(props) => props.view && `
    background-color: #0E86D4;
    flex-direction: row;
    margin-top: 0px;
    border-radius: 60px;
    padding: 2px;
    height: 28px;
    border: 2px solid #003060;
    margin-top: 5px;
    margin-bottom: 5px;
  `}

  ${(props) => props.edit && `
    background-color: #DDDA20;
    flex-direction: row;
    margin-top: 0px;
    border-radius: 60px;
    padding: 5px;
    height: 35px;
    border: 2px solid #8D8B15;
    margin-top: 5px;
    margin-bottom: 5px;
  `}

`

export const ButtonText = styled.Text`
  color: ${primary};
  font-size: 18px;
  

  ${(props) => props.google == true && `
    padding-left: 15px;
  `}

  ${(props) => props.findMaterial == true && `
    font-size: 28px;
    font-weight: 700;
  `}

  ${(props) => props.adminDash == true && `
    font-size: 28px;
    font-weight: 700;
    padding-left: 10px;
  `}

  ${(props) => props.adminStoreProfile == true && `
    font-size: 18px;
    font-weight: 700;
  `}

  ${(props) => props.map == true && `
    font-size: 20px;
    font-weight: 700;
  `}

  ${(props) => props.mapLoading == true && `
    color: ${tertiary};
  `}

`

export const MsgBox = styled.Text`
  text-align: center;
  font-size: 15px;
  font-weight: 700;
  color: ${props => props.type == "SUCCESS" ? green : red};

  ${(props) => props.product == true && `
    font-size: 20px;
    margin-top: 15px;
    color: ${tertiary};
  `}
`

export const Line = styled.View`
  height: 1px;
  width: 100%;
  background-color: ${darkLight};
  margin-top: 15px;
`

export const ExtraView = styled.View`
  justify-content: center;
  flex-direction: row;
  align-items: center;
  padding: 10px;
`

export const ExtraText = styled.Text`
  justify-content: center;
  align-content: center;
  color: ${tertiary};
  font-size: 16px;
  ${(props) => props.storeName == true && `
    font-size: 25px;
    font-weight: 800;
    color: ${brand};
    text-decoration: underline;
  `}
  ${(props) => props.storeAddress == true && `
    font-size: 16px;
    font-weight: 500;
    color: ${brand};
    margin-left: 20px;
  `}
  ${(props) => props.distance && `
    margin-left: 30px;
    margin-right: 15px;
    margin-top: 3px;
    font-weight: 800;
    color: ${brand};
    font-size: 18px;
  `}
`

export const TextLink = styled.TouchableOpacity`
  justify-content: center;
  align-items: center;
`

export const TextLinkContent = styled.Text`
  color: ${brand};
  font-size: 16px;
  ${(props) => props.store && `
    color: #87ceeb;
  `}
`

export const OuterdModalView = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: rgba(0,0,0,0.5);
`

export const InnerModalView = styled.View`
  width: 90%;
  height: 495px;
  border-radius: 10px;
  background: ${primary};
  padding: 15px;
`

export const BottomNav = styled.View`
  position: absolute;
  width: 100%;
  height: 8%;
  bottom: 0px;
  background-color: ${brand};
`

export const NotifiText = styled.Text`
  position: absolute;
  width: 20px;
  height: 20px;
  border-radius: 20px;
  top: 0px;
  right: 0px;
  background-color: ${red};
  color: ${primary};
  font-size: 12px;
  font-weight: 700;
  padding: 3px;
  padding-left: 6px;

`

export const UserText = styled.Text`
  position: absolute;
  width: 150px;
  height: 30px;
  bottom: 10px;
  left: 15px;
  background-color: transparent;
  color: ${primary};
  font-size: 14px;
  font-weight: 700;
  font-style: italic;
`