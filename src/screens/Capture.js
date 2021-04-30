import React, { useState, useEffect} from 'react';
import { View, Alert, StyleSheet, ScrollView, StatusBar, PixelRatio, Dimensions, Image } from 'react-native';
import { Layout, Text, Button } from 'react-native-rapi-ui';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ({ navigation }) {

	useEffect(() => {
		const unsubscribe = navigation.addListener('focus', () => {
		  // The screen is focused
		  // Call any action
		//   createTwoButtonAlert();
			// setSliderState({currentPage: 0});
		});
	
		// Return the function to unsubscribe from the event so it gets removed on unmount
		return unsubscribe;
	}, [navigation]);


	const [sliderState, setSliderState] = useState({ currentPage: 0 });
	const { width, height } = Dimensions.get('window');
  
	const setSliderPage = (event) => {
	  const { currentPage } = sliderState;
	  const { x } = event.nativeEvent.contentOffset;
	  const indexOfNextScreen = Math.round(x / width);
	  if (indexOfNextScreen !== currentPage) {
		setSliderState({
		  ...sliderState,
		  currentPage: indexOfNextScreen,
		});
	  }
	};
	const { currentPage: pageIndex } = sliderState;
  
	return (
		<>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView
          style={{ flex: 1 }}
          horizontal={true}
          scrollEventThrottle={16}
          pagingEnabled={true}
          showsHorizontalScrollIndicator={false}
          onScroll={(event) => {
            setSliderPage(event);
          }}
        >
          <View style={{ width, height }}>
            <Image source={require('../../assets/instruction/movies.jpeg')} style={styles.imageStyle} />
            <View style={styles.wrapper}>
              <Text style={styles.header}>Video</Text>
              <Text style={styles.paragraph}>... it's a 40 seconds video with 8 sample faces</Text>
            </View>
          </View>
          <View style={{ width, height }}>
            <Image
              source={require('../../assets/instruction/lighticon.png')}
              style={styles.imageStyle}
            />
            <View style={styles.wrapper}>
              <Text style={styles.header}>Lighting</Text>
              <Text style={styles.paragraph}>... turn on the light for better picture quality</Text>
            </View>
          </View>

          <View style={{ width, height }}>
            <Image
              source={require('../../assets/instruction/alert.jpeg')}
              style={styles.imageStyle}
            />
            <View style={styles.wrapper}>
              <Text style={styles.header}>Alert for new sample</Text>
              <Text style={styles.paragraph}>... vibration and instruction for each sample face</Text>
            </View>
          </View>
		  <View style={{ width, height }}>
            <Image
              source={require('../../assets/instruction/selfie.jpeg')}
              style={styles.imageStyle}
            />
            <View style={styles.wrapper}>
              <Text style={styles.header}>Center your face</Text>
              <Text style={styles.paragraph}>... put your face inside circle</Text>
            </View>
          </View>
          <View style={{ width, height }}>
            <Image
              source={require('../../assets/instruction/dancing.gif')}
              style={styles.imageStyle}
            />
            <View style={styles.wrapper}>
              <Text style={styles.header}>Let's Start!</Text>
              <Text style={styles.paragraph}>... oooo it was long</Text>
			  <View style={{alignItems: 'center',}}>
					<Button
						status="danger"
						text="I AM GUARDIAN"
						color="#D291BC"
						onPress={() => {
							navigation.navigate('CameraScreen')
						}}
						style={{
							marginTop:10,
							minWidth:200,
						}}
					/>
					<Button
						status="danger"
						text="I AM PATIENT"
						color="#70A1D7"
						onPress={() => {
							navigation.navigate('CameraScreen')
						}}
						style={{
							marginTop:10,
							minWidth:200,
						}}
					/>
			  </View>
            </View>
          </View>
        </ScrollView>
        <View style={styles.paginationWrapper}>
          {Array.from(Array(5).keys()).map((key, index) => (
            <View style={[styles.paginationDots, { opacity: pageIndex === index ? 1 : 0.2 }]} key={index} />
          ))}
        </View>
      </SafeAreaView>
    </>
	);
}

const styles = StyleSheet.create({
	container: {
	  flex: 1,
	  justifyContent: "space-around",
	  alignItems: "center"
	},
	imageStyle: {
		height: PixelRatio.getPixelSizeForLayoutSize(135),
		width: '100%',
	  },
	  wrapper: {
		justifyContent: 'center',
		alignItems: 'center',
		marginVertical: 30,
	  },
	  header: {
		fontSize: 30,
		fontWeight: 'bold',
		marginBottom: 20,
	  },
	  paragraph: {
		fontWeight: 'bold',
		marginTop: 20,
		fontSize: 18,
	  },
	  paginationWrapper: {
		position: 'absolute',
		bottom: 200,
		left: 0,
		right: 0,
		justifyContent: 'center',
		alignItems: 'center',
		flexDirection: 'row',
	  },
	  paginationDots: {
		height: 10,
		width: 10,
		borderRadius: 10 / 2,
		backgroundColor: 'darkblue',
		marginLeft: 10,
	  },
});
