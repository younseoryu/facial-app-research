import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Layout, Text, Button } from 'react-native-rapi-ui';
import * as firebase from 'firebase';
import * as ImagePicker from 'expo-image-picker';

export default function ({ navigation }) {
	const [name, setName] = useState('');
	const [phoneNumber, setPhoneNumber] = useState('');
	const [profileUri, setProfileUri] = useState('');

	//upload the image to storage and update profile url in database
	let uploadImage = async(uri) => {
		const response = await fetch(uri);
		const blob = await response.blob();
		var ref = firebase.storage().ref().child("profileImages/"+firebase.auth().currentUser.uid);
		//upload profile pic to storage
		ref.put(blob).then((snapshot) => {
			//get the download url for the profile pic
			snapshot.ref.getDownloadURL().then((downloadURL) => {
				//update profile pic download url to firebase db
				console.log('db updated, downloadurl: ', downloadURL)
				firebase.database().ref("users/" + firebase.auth().currentUser.uid).update({"profileUrl": downloadURL});
			})
		})	
	}

	let openImagePickerAsync = async () => {
		let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
	
		if (permissionResult.granted === false) {
		  alert("Permission to access camera roll is required!");
		  return;
		}
	
		let pickerResult = await ImagePicker.launchImageLibraryAsync();
		console.log(pickerResult);
		if(!pickerResult.cancelled){
			setProfileUri(pickerResult.uri);
			uploadImage(pickerResult.uri);
		}
	}


	useEffect(() => {
		setName(firebase.auth().currentUser.displayName)
		setPhoneNumber(firebase.auth().currentUser.email.split('@')[0])
		firebase.database().ref("users/" + firebase.auth().currentUser.uid).once('value', (snapshot) => {
			setProfileUri(snapshot.val().profileUrl);
		})
	}, []);

	return (
		<Layout>
			<View style={stylesProfile.container}>
				
				<View style={stylesProfile.header}></View>
				{
					profileUri === '' 
					? 	
						<>
						<Text style={stylesProfile.noprofile}>set a profile picture</Text>
						<TouchableOpacity onPress={openImagePickerAsync} style={stylesProfile.avatarContainer} >
							<Image source={require('../../assets/no-profile.jpeg')} style={stylesProfile.avatar}/>
						</TouchableOpacity>
						</>
					: 
						<TouchableOpacity onPress={openImagePickerAsync}  style={stylesProfile.avatarContainer} >
							<Image source={{uri: profileUri}}  style={stylesProfile.avatar}/>
						</TouchableOpacity>
				}
		
				
				<View style={stylesProfile.body}>
					<View style={stylesProfile.bodyContent}>
						<Text style={stylesProfile.name}>{name}</Text>
						<Text style={stylesProfile.name}>{phoneNumber}</Text>
						<Text style={stylesProfile.info}>Research Participant</Text>
						<Text style={stylesProfile.description}>Thank you for your participation.{"\n"} This is a facial data collection app.</Text>
					</View>
				</View>
			</View>
			<View style={{alignItems: 'center',}}>
					<Button
						status="danger"
						text="Logout"
						color="#70A1D7"
						onPress={() => {
							firebase.auth().signOut();
						}}
						style={{
							marginBottom:30,
							minWidth:200,
						}}
					/>
			</View>
			
		</Layout>
	);
}


const stylesProfile = StyleSheet.create({
	container:{
		flex: 1,
	},
	header:{
	  backgroundColor: "#70A1D7",
	  height:200,
	},
	avatarContainer: {
	  width: 130,
	  height: 130,
	  borderRadius: 63,
	  borderColor: "white",
	  marginBottom:10,
	  padding: 0,
	  alignSelf:'center',
	  position: 'absolute',
	  marginTop:130
	},
	noprofile:{
	  fontSize:28,
	  color: "#696969",
	  fontWeight: "600",
	  height: 130,
	  borderRadius: 63,
	  borderColor: "white",
	  marginBottom:10,
	  padding: 0,
	  alignSelf:'center',
	  position: 'absolute',
	  marginTop:90
	},
	avatar: {
	  width: 130,
	  height: 130,
	  borderRadius: 63,
	  borderWidth: 4,
	  borderColor: "white",
	  padding: 0,
	  margin: 0,
	  alignSelf:'center',
	  position: 'absolute',
	},
	name:{
	  fontSize:28,
	  color: "#696969",
	  fontWeight: "600"
	},
	body:{
	  marginTop:40,
	},
	bodyContent: {
	  flex: 1,
	  alignItems: 'center',
	  padding:30,
	},
	info:{
	  fontSize:16,
	  color: "#00BFFF",
	  marginTop:10
	},
	description:{
	  fontSize:16,
	  color: "#696969",
	  marginTop:10,
	  textAlign: 'center'
	},
	buttonContainer: {
	  marginTop:30,
	  height:45,
	  flexDirection: 'row',
	  justifyContent: 'center',
	  alignItems: 'center',
	  width:250,
	  borderRadius:30,
	  backgroundColor: "#00BFFF",
	},
  });