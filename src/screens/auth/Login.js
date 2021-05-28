import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import {
	ScrollView,
	TouchableOpacity,
	View,
	KeyboardAvoidingView,
	Image,
} from 'react-native';
import * as firebase from 'firebase';

import { Layout, Text, TextInput, Button } from 'react-native-rapi-ui';

export default function ({ navigation }) {
	const [phoneNumber, setPhoneNumber] = useState('');
	// const [email, setEmail] = useState('');
	// const [password, setPassword] = useState('');
	const [loading, setLoading] = useState(false);

	async function login() {
		setLoading(true);
		await firebase
			.auth()
			.signInWithEmailAndPassword(phoneNumber + "@given.email", "givenpassword")
			.catch(function (error) {
				// Handle Errors here.
				var errorCode = error.code;
				var errorMessage = error.message;
				// ...
				setLoading(false);
				alert(errorMessage);
			});
	}

	return (
		<KeyboardAvoidingView behavior="height" enabled style={{ flex: 1 }}>
			<StatusBar style="auto" translucent backgroundColor="#f7f7f7" />
			<Layout >
				<ScrollView
					contentContainerStyle={{
						flexGrow: 1,
					}}
					keyboardShouldPersistTaps='handled'
				>
					<View
						style={{
							flex: 1,
							justifyContent: 'center',
							alignItems: 'center',
							backgroundColor: '#ffffff',
						}}
					>
						<Image
							resizeMode="contain"
							style={{
								height: 220,
								width: 220,
							}}
							source={require('../../../assets/smilemind2.png')}
						/>
					</View>
					<View
						style={{
							flex: 3,
							paddingHorizontal: 20,
							paddingBottom: 20,
							backgroundColor: '#fff',
						}}
					>
						<Text
							fontWeight="bold"
							style={{
								alignSelf: 'center',
								padding: 30,
							}}
							size="h3"
						>
							Login for SmileMind
						</Text>

						<Text>Phone Number</Text>
						<TextInput
							containerStyle={{ marginTop: 15 }}
							placeholder="Enter your phone number"
							value={phoneNumber}
							autoCapitalize="none"
							autoCompleteType="off"
							autoCorrect={false}
							keyboardType="number-pad"
							onChangeText={(text) => setPhoneNumber(text)}
						/>

						{/* <Text>Email</Text>
						<TextInput
							containerStyle={{ marginTop: 15 }}
							placeholder="Enter your email"
							value={email}
							autoCapitalize="none"
							autoCompleteType="off"
							autoCorrect={false}
							keyboardType="email-address"
							onChangeText={(text) => setEmail(text)}
						/> */}

						{/* <Text style={{ marginTop: 15 }}>Password</Text>
						<TextInput
							containerStyle={{ marginTop: 15 }}
							placeholder="Enter your password"
							value={password}
							autoCapitalize="none"
							autoCompleteType="off"
							autoCorrect={false}
							secureTextEntry={true}
							onChangeText={(text) => setPassword(text)}
						/> */}
						<Button
							text={loading ? 'Loading' : 'Get a call to continue'}
							onPress={() => {
								login();
							}}
							style={{
								marginTop: 20,
							}}
							disabled={loading}
						/>

						<View
							style={{
								flexDirection: 'row',
								alignItems: 'center',
								marginTop: 15,
								justifyContent: 'center',
							}}
						>
							<Text size="md">Don't have an account?</Text> 
							<TouchableOpacity
								onPress={() => {
									navigation.navigate('Register');
								}}
							>
								<Text
									size="md"
									fontWeight="bold"
									style={{
										marginLeft: 5,
									}}
								>
									Register here
								</Text>
							</TouchableOpacity>
						</View>
						<View
							style={{
								flexDirection: 'row',
								alignItems: 'center',
								marginTop: 10,
								justifyContent: 'center',
							}}
						>
							{/* <TouchableOpacity
								onPress={() => {
									navigation.navigate('ForgetPassword');
								}}
							>
								<Text size="md" fontWeight="bold">
									Forget password
								</Text>
							</TouchableOpacity> */}
						</View>
					</View>
				</ScrollView>
			</Layout>
		</KeyboardAvoidingView>
	);
}
