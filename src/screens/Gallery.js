import React, {useState} from 'react';
import { View, ScrollView, Button, Dimensions, StyleSheet, TouchableOpacity } from 'react-native';
import { Layout, Text } from 'react-native-rapi-ui';
import { useFocusEffect } from '@react-navigation/native';
import * as firebase from 'firebase';
import * as WebBrowser from 'expo-web-browser';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default function ({ navigation }) {
	const [urlsArr, setUrlsArr] = useState([]);
	
	let handleOpenWithWebBrowser = (url) => {
		WebBrowser.openBrowserAsync(url);
	};

	useFocusEffect(
        React.useCallback(() => {

			// Do something when the screen is focused
			console.log('focused!')
			// get snapshot of downloadUrls {time : downloadUrl}
			const fullPath = "users/" + firebase.auth().currentUser.uid+"/downloadUrls";
			firebase.database().ref(fullPath).once('value', (snapshot) => {
				const snapshotVal = snapshot.val()
				//convert to current time zone using new Date(), and remove characters including and after 'GMT' 
				let urlArray = Object.keys(snapshotVal).map((key) => [String(new Date(key)).split('GMT')[0], snapshotVal[key]]);
				//sort array by key value (time)
				setUrlsArr( urlArray.sort(function(a,b) { return a[0]-b[0]}) );
			})

			return () => {
				// called when losing focus. good for cleanup
			};
        }, [])
    );

	return (
		<ScrollView contentContainerStyle={ styles.container }>
			{urlsArr.map((key, idx) => (
				//map only when index is odd number
				idx % 2 == 1 ||
				<View style={styles.column} key={idx}>
						<View style={styles.box}>
							<TouchableOpacity
								style={styles.touch}
								onPress={()=>{
									handleOpenWithWebBrowser(urlsArr[idx][1]);
								}}
							>
								<Text style={styles.text}>{urlsArr[idx][0]}</Text>
							</TouchableOpacity>
						</View>
					{
						idx == urlsArr.length - 1 && urlsArr.length % 2 == 1
						?
						<View style={styles.emptyBox}></View>
						:
						<View style={styles.box}>
							<TouchableOpacity
								style={styles.touch}
								onPress={()=>{
									handleOpenWithWebBrowser(urlsArr[idx+1][1]);
								}}
							>
								<Text style={styles.text}>{urlsArr[idx+1][0]}</Text>
							</TouchableOpacity>
						</View>
					}
				</View>
			))}
		</ScrollView>
	);
}



const styles = StyleSheet.create({
	container: {
		flexGrow: 1,
		borderColor: 'transparent', 
		borderWidth: 8, 
		flexDirection:'column'
	},
	column: {
		height:windowHeight/5, 
		flexDirection:'row',
	},
    box: {
		flex:1, 
		borderColor: 'black',
		borderWidth: 2,
		backgroundColor:'#70A1D7', 
		borderRadius: 20,
		margin: 3,
		padding: 2,
    },
	emptyBox: {
		flex:1, 
		borderColor: 'transparent',
		borderWidth: 2,
		backgroundColor:'transparent', 
    },
	touch: {
		flex:1, 
    },
	text: {
		flex:1, 
		backgroundColor:'transparent', 
		textAlign:"center", 
		textAlignVertical: 'center',
		fontSize: 22,
    },
  });