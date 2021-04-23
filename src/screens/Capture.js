import React, { useState, useEffect} from 'react';
import { View, Alert, StyleSheet, Button } from 'react-native';
import { Layout, Text } from 'react-native-rapi-ui';

export default function ({ navigation }) {

	useEffect(() => {
		const unsubscribe = navigation.addListener('focus', () => {
		  // The screen is focused
		  // Call any action
		  createTwoButtonAlert();
		});
	
		// Return the function to unsubscribe from the event so it gets removed on unmount
		return unsubscribe;
	}, [navigation]);
	
	const createTwoButtonAlert = () =>{
		const instruction_msg = String(
			"\n"+ "There are 8 sample faces to make." 
			+ "\n" + "\n" + "5 pictures will be taken for each face."  
			+ "\n" + "\n" + "The process will take a minute in total." 
			+ "\n" + "\n" + "If you are ready, press the button below." 
		)
		Alert.alert(
			"Instructions",
			instruction_msg,
			[
				{
				text: "Cancel",
				onPress: () => console.log("Cancel Pressed"),
				style: "cancel"
				},
				{ text: "Proceed", onPress: () => navigation.navigate('CameraScreen')}
			],
			{ cancelable: false }
		)};

	return (
		<Layout>
			{/* <View style={styles.container}>
				<Button title="2-Button Alert" onPress={createTwoButtonAlert} />
			</View> */}
		</Layout>
	);
}

const styles = StyleSheet.create({
	container: {
	  flex: 1,
	  justifyContent: "space-around",
	  alignItems: "center"
	}
});
