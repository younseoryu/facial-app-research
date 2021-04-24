import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, Dimensions} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Layout, TopNav, theme } from 'react-native-rapi-ui';
import { Ionicons } from '@expo/vector-icons';
// import { SimpleLineIcons } from '@expo/vector-icons'; 
import { Feather } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Camera } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import * as Permissions from "expo-permissions";
import * as FileSystem from 'expo-file-system';
import * as firebase from 'firebase';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const aspectRatio = Dimensions.get('window').width / Dimensions.get('window').height; 

export default function ({ navigation }) {

    const [cameraPermission, setCameraPermission] = useState(null);
    const [mediaPermission, setMediaPermission] = useState(null);
    const [audioPermission, setAudioPermission] = useState(null);
    const [isRecording, setIsRecording] = useState(false);
    const [progress, setProgress] = useState(0);
    const [type, setType] = useState(Camera.Constants.Type.front);
    const cameraRef = useRef(null)

    // useEffect(() => {
    //     (async () => {
    //         const  cameraStatus  = await Camera.requestPermissionsAsync();
    //         setCameraPermission(cameraStatus.status === 'granted');
    //         const  mediaStatus  = await MediaLibrary.requestPermissionsAsync();
    //         setMediaPermission(mediaStatus.status === 'granted');
    //         const audioStatus = await Permissions.askAsync(Permissions.AUDIO_RECORDING);
    //         setAudioPermission(audioStatus.status === 'granted');

    //     })();
    // }, []);

    useFocusEffect(
        React.useCallback(() => {
          // Do something when the screen is focused
            (async () => {
                const  cameraStatus  = await Camera.requestPermissionsAsync();
                setCameraPermission(cameraStatus.status === 'granted');
                const  mediaStatus  = await MediaLibrary.requestPermissionsAsync();
                setMediaPermission(mediaStatus.status === 'granted');
                const audioStatus = await Permissions.askAsync(Permissions.AUDIO_RECORDING);
                setAudioPermission(audioStatus.status === 'granted');
            })();
        
          return () => {
            // Do something when the screen is unfocused
            // Useful for cleanup functions
            console.log("lost focus! stop recording.")
            cameraRef.current.stopRecording(recordOptions);
          };
        }, [])
    );

    if (cameraPermission === null) {
        return <View />;
    } else if (cameraPermission === false) {
        return <Text>No access to camera</Text>;
    }
    if (mediaPermission === null) {
        return <View />;
    } else if (mediaPermission === false) {
        return <Text>No access to media library</Text>;
    }
    if (audioPermission === null) {
        return <View />;
    } else if (audioPermission === false) {
        return <Text>No access to audio</Text>;
    }

    //take video and return asset obj
    const snap = async () => {
        // const albumName = "Instagram"
        let cachedVideo;
        if (cameraRef) {
            try{
              cachedVideo = await cameraRef.current.recordAsync(recordOptions)
              .then(setIsRecording(true))
              if(cachedVideo){
                setIsRecording(false);
              }
            } catch (error) {
              console.error(error);
            }
            console.log(cachedVideo);
        } 
        const asset = await MediaLibrary.createAssetAsync(cachedVideo.uri);
        return asset;
    };

    function progressBar(timeleft, timetotal) {
        setProgress(timetotal - timeleft);
        if(timeleft > 0) {
            setTimeout(function() {
                progressBar(timeleft - 1, timetotal);
            }, 1000);
        } else{
            setTimeout(function() {
                setProgress(0);
            }, 1000);
        }
    };

    let uriToBlob = (uri) => {
        return new Promise((resolve, reject) => {
          const xhr = new XMLHttpRequest();
          xhr.onload = function() {
            // return the blob
            resolve(xhr.response);
          };
          xhr.onerror = function() {
            // something went wrong
            reject(new Error('uriToBlob failed'));
          };
          // this helps us get a blob
          xhr.responseType = 'blob';
          xhr.open('GET', uri, true);
          xhr.send(null);
        });
      }

      let uploadToFirebase = (blob) => {
        return new Promise((resolve, reject)=>{
          console.log('blob:\n', JSON.stringify(blob._data.name))
          const usrName = firebase.auth().currentUser.displayName.replace(/\s+/g, '-').toLowerCase();
          const usrUID = firebase.auth().currentUser.uid;
          const currTime = new Date().toISOString().substring(0,19);
          const fullPath = "videos/" + usrName + "-" + usrUID + "/";
          const fileName = currTime + "-" + blob._data.name;    
          var storageRef = firebase.storage().ref(fullPath + fileName);
          storageRef.put(blob).then((snapshot)=>{
            blob.close();
            resolve(snapshot);
          }).catch((error)=>{
            reject(error);
          });
        });
      }      
    

	return (
		<Layout>
			<TopNav
				middleContent="Camera Screen"
				leftContent={
					<Ionicons name="chevron-back" size={20} color={theme.black} />
				}
				leftAction={() => navigation.goBack()}
			/>
			<View style={styles.container}>
                <Camera ref = {cameraRef}  style={styles.camera} type={type}  >
                
                    <View style={{flex:1}}>
                        <View style={{ flex: 3, backgroundColor: "transparent",  flexDirection:"row" }}>
                            <View style={{ flex: 1}}>  
                                {progress < recordOptions.maxDuration * 1 / 8 ?  <Image style={styles.imageStyle} source={require('../../assets/sampleFaces/facial-expression-one.png')}/> : <></>}
                                {progress < recordOptions.maxDuration * 2 / 8 ?  <Image style={styles.imageStyle} source={require('../../assets/sampleFaces/facial-expression-two.png')}/> : <></>}
                                {progress < recordOptions.maxDuration * 3 / 8 ?  <Image style={styles.imageStyle} source={require('../../assets/sampleFaces/facial-expression-three.png')}/> : <></>}
                                {progress < recordOptions.maxDuration * 4 / 8 ?  <Image style={styles.imageStyle} source={require('../../assets/sampleFaces/facial-expression-four.png')}/> : <></>}
                                {progress < recordOptions.maxDuration * 5 / 8 ?  <Image style={styles.imageStyle} source={require('../../assets/sampleFaces/facial-expression-five.png')}/> : <></>}
                                {progress < recordOptions.maxDuration * 6 / 8 ?  <Image style={styles.imageStyle} source={require('../../assets/sampleFaces/facial-expression-six.png')}/> : <></>}
                                {progress < recordOptions.maxDuration * 7 / 8 ?  <Image style={styles.imageStyle} source={require('../../assets/sampleFaces/facial-expression-seven.png')}/> : <></>}
                                {progress < recordOptions.maxDuration * 8 / 8 ?  <Image style={styles.imageStyle} source={require('../../assets/sampleFaces/facial-expression-eight.png')}/> : <></>}
                            </View>
                            <View style={{ flex: 1, backgroundColor: "transparent" }}/>
                            <View style={{ flex: 1, backgroundColor: "transparent" }}/>
                        </View>
                        <View style={{ flex: 3, backgroundColor: "transparent" }} />
                        <View style={{ flex: 3, backgroundColor: "transparent" }} />
                    </View>
                    
                </Camera>

                {/* bottom container for buttons */}
                <View style={styles.buttonContainer}> 
                    <View style={{ flex: 1}}>
                        <TouchableOpacity
                                style={styles.button}
                                onPress={() => {
                                setType(
                                    type === Camera.Constants.Type.back
                                    ? Camera.Constants.Type.front
                                    : Camera.Constants.Type.back
                                );
                                }}>
                                <MaterialCommunityIcons
                                    name='camera-retake-outline'
                                    style={styles.button}
                                    size={50}
                                />
                         </TouchableOpacity> 
                    </View>
                    <View style={{ flex: 1 }} >
                        {
                             isRecording === true 
                             ?
                             <TouchableOpacity
                                style={styles.button}
                                onPress={() => {
                                    // snap();
                                }}>
                                <MaterialCommunityIcons name="record-circle-outline" style={styles.button, {color:'red'}} size={60} />
                            </TouchableOpacity>
                             :
                             <TouchableOpacity
                                style={styles.button}
                                onPress={async () => {
                                    progressBar(recordOptions.maxDuration, recordOptions.maxDuration);
                                    let assetObj = await snap();
                                    if (assetObj.duration <  recordOptions.maxDuration-1) {
                                        console.log("recording interrupted. no need to upload video to storage");
                                        return; 
                                    } 
                                    uriToBlob(assetObj.uri).then(async(blob)=>{
                                        return uploadToFirebase(blob);
                                    }).then((snapshot)=>{
                                        // console.log("File uploaded: ", snapshot);
                                        console.log("upload success!")
                                    }).catch((err)=>{
                                        console.log(err)
                                    }); 
                                    
                                }}>
                                <Feather name="play-circle" style={styles.button} size={60} />
                            </TouchableOpacity>
                        }
                    </View>
                    <View style={{ flex: 1 }} >
                        <TouchableOpacity style={styles.button}>
                            {/* <Feather name="pause-circle" style={styles.button} size={50} /> */}
                            <Text style={styles.text}>{progress}/{recordOptions.maxDuration}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
		</Layout>
	);
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    camera: {
      flex: 85,
    },
    buttonContainer: {
      flex: 15,
      flexDirection: 'row',
      backgroundColor: 'black',
      borderColor:'white',
      borderTopWidth:1,
    },
    button: {
        flex: 1,
        // alignSelf: 'flex-end',
        justifyContent: 'center',
        alignItems: 'center',
        color: 'white',
        margin: 10,
    },
    text: {
        fontSize: 28,
        flex: 1,
        // alignSelf: 'flex-end',
        justifyContent: 'center',
        alignItems: 'center',
        color: 'white',
        margin: 15,
    },
    pictureOverlay:{
        flex: 1,
    },
    imageStyle: {
        alignSelf: 'center',
        height:'95%', 
        width:'95%',
        borderRadius: 150 / 4,
        marginLeft:10,
        marginTop:10,
        borderColor:'white',
        borderWidth:1,
    },
  });

  const recordOptions = {
      maxDuration: 32,
      mute: true,
  }

  const encodingOptions = {
      encoding: FileSystem.EncodingType.Base64,
  }