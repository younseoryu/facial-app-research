import React, { useContext } from 'react';
import * as firebase from 'firebase';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { theme } from 'react-native-rapi-ui';
import TabBarIcon from '../components/utils/TabBarIcon';
import TabBarText from '../components/utils/TabBarText';
//Screens
import SecondScreen from '../screens/SecondScreen';
import CameraScreen from '../screens/CameraScreen';
import Capture from '../screens/Capture';
import Gallery from '../screens/Gallery';
import Inbox from '../screens/Inbox';
import Profile from '../screens/Profile';
import Loading from '../screens/utils/Loading';
// Auth screens
import Login from '../screens/auth/Login';
import Register from '../screens/auth/Register';
import ForgetPassword from '../screens/auth/ForgetPassword';
import { AuthContext } from '../provider/AuthProvider';

// Better put your these secret keys in .env file
const firebaseConfig = {
	apiKey: "AIzaSyD8XBQK4_G8RgrcasjjkesyGPgW6O0l7OA",
    authDomain: "facial-prototype.firebaseapp.com",
    databaseURL: "https://facial-prototype-default-rtdb.firebaseio.com",
    projectId: "facial-prototype",
    storageBucket: "facial-prototype.appspot.com",
    messagingSenderId: "776395605032",
    appId: "1:776395605032:web:ef4912b00a1846d8a6211d",
    measurementId: "G-N3K4ETB024"
};

if (firebase.apps.length === 0) {
	firebase.initializeApp(firebaseConfig);
}

const AuthStack = createStackNavigator();
const Auth = () => {
	return (
		<AuthStack.Navigator
			screenOptions={{
				headerShown: false,
			}}
		>
			<AuthStack.Screen name="Login" component={Login} />
			<AuthStack.Screen name="Register" component={Register} />
			<AuthStack.Screen name="ForgetPassword" component={ForgetPassword} />
		</AuthStack.Navigator>
	);
};

const MainStack = createStackNavigator();
const Main = () => {
	return (
		<MainStack.Navigator
			screenOptions={{
				headerShown: false,
			}}
		>
			<MainStack.Screen name="MainTabs" component={MainTabs} />
			<MainStack.Screen name="SecondScreen" component={SecondScreen} />
			<MainStack.Screen name="CameraScreen" component={CameraScreen} />
		</MainStack.Navigator>
	);
};

const Tabs = createBottomTabNavigator();
const MainTabs = () => {
	return (
		<Tabs.Navigator
			tabBarOptions={{
				tabStyle: { borderTopWidth: 0 },
				style: { borderTopWidth: 1, borderColor: '#c0c0c0', height: 60, paddingBottom: 4, paddingTop: 2 },
				activeTintColor: theme.primary,
			}}
		>
			<Tabs.Screen
				name="Profile"
				component={Profile}
				options={{
					tabBarLabel: ({ focused }) => (
						<TabBarText focused={focused} title="Profile" />
					),
					tabBarIcon: ({ focused }) => (
						<TabBarIcon focused={focused} icon={'person'} />
					),
				}}
			/>
			<Tabs.Screen
				name="Capture"
				component={Capture}
				options={{
					tabBarLabel: ({ focused }) => (
						<TabBarText focused={focused} title="Capture" />
					),
					tabBarIcon: ({ focused }) => (
						<TabBarIcon focused={focused} icon={'camera'} />
					),
				}}
			/>
			<Tabs.Screen
				name="Gallery"
				component={Gallery}
				options={{
					tabBarLabel: ({ focused }) => (
						<TabBarText focused={focused} title="Gallery" />
					),
					tabBarIcon: ({ focused }) => (
						<TabBarIcon focused={focused} icon={'albums'} />
					),
				}}
			/>
			<Tabs.Screen
				name="Inbox"
				component={Inbox}
				options={{
					tabBarLabel: ({ focused }) => (
						<TabBarText focused={focused} title="Inbox" />
					),
					tabBarIcon: ({ focused }) => (
						<TabBarIcon focused={focused} icon={'chatbubble'} />
					),
				}}
			/>
		</Tabs.Navigator>
	);
};

export default () => {
	const auth = useContext(AuthContext);
	const user = auth.user;
	return (
		<NavigationContainer>
			{user == null && <Loading />}
			{user == false && <Auth />}
			{user == true && <Main />}
		</NavigationContainer>
	);
};
