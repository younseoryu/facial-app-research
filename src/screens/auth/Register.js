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
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [loading, setLoading] = useState(false);

	async function register() {
		if(name === ''){
			alert("Please enter your name");
			return;
		}
		setLoading(true);
		await firebase
			.auth()
			.createUserWithEmailAndPassword(email, password)
			.then(resolveObj => {
				firebase.auth().currentUser.updateProfile({ displayName: name });
				const usrUID = firebase.auth().currentUser.uid;
				firebase.database().ref('users/' + usrUID).set({
					username: name,
					email: email,
				});
			})
			.catch( err => {
				// Handle Errors here.
				var errorCode = err.code;
				var errorMessage = err.message;
				// ...
				setLoading(false);
				alert(errorMessage);
				return;
			});
	}

	return (
		<KeyboardAvoidingView behavior="height" enabled style={{ flex: 1 }}>
			<StatusBar style="auto" translucent backgroundColor="#f7f7f7" />
			<Layout>
				<ScrollView
					contentContainerStyle={{
						flexGrow: 1,
					}}
				>
					<View
						style={{
							flex: 1,
							justifyContent: 'center',
							alignItems: 'center',
							backgroundColor: '#f7f7f7',
						}}
					>
						<Image
							resizeMode="contain"
							style={{
								height: 220,
								width: 220,
							}}
							source={require('../../../assets/register.png')}
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
							size="h3"
							style={{
								alignSelf: 'center',
								padding: 30,
							}}
						>
							Register
						</Text>
						
						<Text>Name</Text>
						<TextInput
							containerStyle={{ marginTop: 15 }}
							placeholder="Enter your name"
							value={name}
							autoCapitalize="none"
							autoCompleteType="off"
							autoCorrect={false}
							keyboardType="default"
							onChangeText={(text) => setName(text)}
						/>

						<Text style={{ marginTop: 15 }}>Email</Text>
						<TextInput
							containerStyle={{ marginTop: 15 }}
							placeholder="Enter your email"
							value={email}
							autoCapitalize="none"
							autoCompleteType="off"
							autoCorrect={false}
							keyboardType="email-address"
							onChangeText={(text) => setEmail(text)}
						/>

						<Text style={{ marginTop: 15 }}>Password</Text>
						<TextInput
							containerStyle={{ marginTop: 15 }}
							placeholder="Enter your password"
							value={password}
							autoCapitalize="none"
							autoCompleteType="off"
							autoCorrect={false}
							secureTextEntry={true}
							onChangeText={(text) => setPassword(text)}
						/>
						<Button
							text={loading ? 'Loading' : 'Create an account'}
							onPress={() => {
								register();
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
							<Text size="md">Already have an account?</Text>
							<TouchableOpacity
								onPress={() => {
									navigation.navigate('Login');
								}}
							>
								<Text
									size="md"
									fontWeight="bold"
									style={{
										marginLeft: 5,
									}}
								>
									Login here
								</Text>
							</TouchableOpacity>
						</View>
					</View>
				</ScrollView>
			</Layout>
		</KeyboardAvoidingView>
	);
}
