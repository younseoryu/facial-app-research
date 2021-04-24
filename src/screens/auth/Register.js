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
	const [firstName, setFirstName] = useState('');
	const [lastName, setLastName] = useState('');
	const [birthYear, setBirthYear] = useState('');
	const [phoneNumber, setPhoneNumber] = useState('');
	// const [password, setPassword] = useState('');
	const [loading, setLoading] = useState(false);

	//phone number + @given.email as email, password is given as "givenpassword"
	async function register() {
		if (firstName === ''){
			alert("Please enter your first name");
			return;
		}
		if (lastName === ''){
			alert("Please enter your last name");
			return;
		}
		if (birthYear === ''){
			alert("Please enter your birth year");
			return;
		}
		if (birthYear.length !== 4){
			alert("Birth year should be four digits");
			return;
		}
		setLoading(true);
		await firebase
			.auth()
			.createUserWithEmailAndPassword(phoneNumber + "@given.email", "givenpassword")
			.then(resolveObj => {
				firebase.auth().currentUser.updateProfile({ displayName: firstName + " " + lastName });
				const usrUID = firebase.auth().currentUser.uid;
				firebase.database().ref('users/' + usrUID).set({
					firstName: firstName,
					lastName: lastName,
					birthYear: birthYear,
					phoneNumber: phoneNumber,
					profileUrl: '',
				});
			})
			.catch( err => {
				// Handle Errors here.
				var errorCode = err.code;
				var errorMessage = err.message;
				// ...
				setLoading(false);
				if (errorCode === "auth/email-already-in-use"){
					alert("The phone number is already in use.")
				} else {
					alert(errorMessage);
				}
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
					keyboardShouldPersistTaps='handled'
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
								padding: 20,
							}}
						>
							Register
						</Text>
						
						<Text>First Name</Text>
						<TextInput
							containerStyle={{ marginTop: 10 }}
							placeholder="Enter your first name"
							value={firstName}
							autoCapitalize="none"
							autoCompleteType="off"
							autoCorrect={false}
							keyboardType="default"
							onChangeText={(text) => setFirstName(text)}
						/>

						<Text style={{ marginTop: 15 }}>Last Name</Text>
						<TextInput
							containerStyle={{ marginTop: 10 }}
							placeholder="Enter your last name"
							value={lastName}
							autoCapitalize="none"
							autoCompleteType="off"
							autoCorrect={false}
							keyboardType="default"
							onChangeText={(text) => setLastName(text)}
						/>

						<Text style={{ marginTop: 15 }}>Birth Year</Text>
						<TextInput
							containerStyle={{ marginTop: 10 }}
							placeholder="Enter your birth year"
							value={birthYear}
							autoCapitalize="none"
							autoCompleteType="off"
							autoCorrect={false}
							keyboardType="number-pad"
							onChangeText={(text) => setBirthYear(text)}
						/>

						<Text style={{ marginTop: 15 }}>Phone Number</Text>
						<TextInput
							containerStyle={{ marginTop: 10 }}
							placeholder="Enter your phone number"
							value={phoneNumber}
							autoCapitalize="none"
							autoCompleteType="off"
							autoCorrect={false}
							keyboardType="number-pad"
							onChangeText={(text) => setPhoneNumber(text)}
						/>

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
