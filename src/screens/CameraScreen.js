import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, Dimensions} from 'react-native';
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
    const [rollPermission, setRollPermission] = useState(null);
    const [writePermission, setWritePermission] = useState(null);
    const [isRecording, setIsRecording] = useState(false);
    const [progress, setProgress] = useState(0);
    const [type, setType] = useState(Camera.Constants.Type.front);
    const cameraRef = useRef(null)

    useEffect(() => {
        (async () => {
            
            const  cameraStatus  = await Camera.requestPermissionsAsync();
            setCameraPermission(cameraStatus.status === 'granted');
            const  mediaStatus  = await MediaLibrary.requestPermissionsAsync();
            setMediaPermission(mediaStatus.status === 'granted');
            const audioStatus = await Permissions.askAsync(Permissions.AUDIO_RECORDING);
            setAudioPermission(audioStatus.status === 'granted');
            // const rollStatus = await Permissions.askAsync(Permissions.CAMERA);
            // setRollPermission(rollStatus.status === 'granted');
            // const writeStatus = await Permissions.askAsync(Permissions.WRITE_EXTERNAL_STORAGE);
            // setWritePermission(writeStatus.status === 'granted');

        })();
    }, []);

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
    // if (rollPermission === null) {
    //     return <View />;
    // } else if (rollPermission === false) {
    //     return <Text>No access to roll</Text>;
    // }
    // if (writePermission === null) {
    //     return <View />;
    // } else if (writePermission === false) {
    //     return <Text>No access to write</Text>;
    // }

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
        // const album = await MediaLibrary.getAlbumAsync(albumName);
        // if (album != null){
        //     console.log('adding to existing album (', albumName ,')');
        //     MediaLibrary.addAssetsToAlbumAsync(asset, album, false);
        // } else{
        //     console.log('creating a new album (', albumName ,')');
        //     MediaLibrary.createAlbumAsync(albumName, asset, false);
        // }
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
          const usrUID =  firebase.auth().currentUser.uid;
          const fullPath = "videos/" + usrUID + "/" + blob._data.name;
          var storageRef = firebase.storage().ref(fullPath);
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
                                <Image style={styles.imageStyle} source={require('../../assets/sampleFaces/facial-expression-one.png')}/>
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
      maxDuration: 30,
      mute: true,
  }

  const encodingOptions = {
      encoding: FileSystem.EncodingType.Base64,
  }