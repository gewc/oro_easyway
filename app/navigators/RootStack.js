import React from 'react';
import { Colors } from '../components/styles';

//React Navigate
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import MainStoreScreen from '../screens/MainStoreScreen';
import DashboardScreen from '../screens/DashboardScreen';
import MaterialSearch from '../screens/MaterialSearch';
import StoreSearch from '../screens/StoreSearch';
import AddStoreDetailsScreen from '../screens/AddStoreDetailsScreen';
import MapScreen from '../screens/MapScreen';
import StoreMenuScreen from '../screens/StoreMenuScreen';
import StoreProductListScreen from '../screens/StoreProductListScreen';
import StoreProfileScreen from '../screens/StoreProfileScreen';


const Stack = createNativeStackNavigator();
const { primary, tertiary } = Colors;

const RootStack = () =>{
    return(
        <NavigationContainer>
            <Stack.Navigator
                screenOptions={{
                    headerStyle:{
                        backgroundColor: 'transparent'
                    },
                    headerTintColor: tertiary,
                    headerTitle: '',
                    headerTransparent: true,
                    headerLeftContainerStyle:{
                        paddingLeft: 20
                    }
                }}
                initialRouteName="Login"
            >

                {/* For ADMIN App */}
                {/* <Stack.Screen name="Login" component={LoginScreen} /> */}
                {/* <Stack.Screen name="Register" component={RegisterScreen} /> */}
                
                {/* For Store App */}
                <Stack.Screen name="MainStoreScreen" component={MainStoreScreen} />
                <Stack.Screen name="AddStoreDetailsScreen" component={AddStoreDetailsScreen} />
                <Stack.Screen name="MapScreen" component={MapScreen} options={{ headerTintColor: primary}} />
                <Stack.Screen name="StoreMenuScreen" component={StoreMenuScreen} options={{headerBackVisible: false}}/>
                <Stack.Screen name="StoreProfileScreen" component={StoreProfileScreen} options={{ headerTintColor: tertiary}} />
                <Stack.Screen name="StoreProductListScreen" component={StoreProductListScreen} options={{ headerTintColor: tertiary}} />
                
                {/* For Customer App */}
                <Stack.Screen name="Dashboard" component={DashboardScreen} />
                <Stack.Screen name="MaterialSearch" component={MaterialSearch} options={{ headerTintColor: primary}} />
                <Stack.Screen name="StoreSearch" component={StoreSearch} options={{ headerTintColor: primary}} />

            </Stack.Navigator>
        </NavigationContainer>
    )
}

export default RootStack;