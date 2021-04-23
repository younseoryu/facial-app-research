import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Layout, Text } from 'react-native-rapi-ui';
import * as firebase from 'firebase';

export default function ({ navigation }) {
	const [name, setName] = useState('');
	const [phoneNumber, setPhoneNumber] = useState('');

	useEffect(() => {
		setName(firebase.auth().currentUser.displayName)
		setPhoneNumber(firebase.auth().currentUser.email.split('@')[0])
	}, []);

	return (
		<Layout>
			<View style={stylesProfile.container}>
				<View style={stylesProfile.header}></View>
				<TouchableOpacity style={stylesProfile.avatarContainer} >
					<Image source={{uri: "https://bootdey.com/img/Content/avatar/avatar7.png"}}  style={stylesProfile.avatar}/>
				</TouchableOpacity>
				<View style={stylesProfile.body}>
					<View style={stylesProfile.bodyContent}>
						<Text style={stylesProfile.name}>{name}</Text>
						<Text style={stylesProfile.name}>{phoneNumber}</Text>
						<Text style={stylesProfile.info}>Research Participant</Text>
						<Text style={stylesProfile.description}>Thank you for your participation.{"\n"} This is a facial data collection app.</Text>
						
						{/* <TouchableOpacity style={stylesProfile.buttonContainer} >
							<Text></Text>  
						</TouchableOpacity>              
						<TouchableOpacity style={stylesProfile.buttonContainer} >
							<Text></Text> 
						</TouchableOpacity> */}
					</View>
				</View>
			</View>
		</Layout>
	);
}


const stylesProfile = StyleSheet.create({
	header:{
	  backgroundColor: "#00BFFF",
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