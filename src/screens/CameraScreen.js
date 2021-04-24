import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, Dimensions, Vibration, ImageBackground} from 'react-native';
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
import * as Progress from 'react-native-progress';


const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const aspectRatio = Dimensions.get('window').width / Dimensions.get('window').height; 

export default function ({ navigation }) {

    const [cameraPermission, setCameraPermission] = useState(null);
    const [mediaPermission, setMediaPermission] = useState(null);
    const [audioPermission, setAudioPermission] = useState(null);
    const [isRecording, setIsRecording] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [progress, setProgress] = useState(0);
    const isRecordingInterrupted = useRef(false);
    const [type, setType] = useState(Camera.Constants.Type.front);
    const cameraRef = useRef(null)

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
            isRecordingInterrupted.current = true;
            console.log('lost focus! setting isRecordingInterrupted to: ', isRecordingInterrupted);
            console.log('stopRecording() called and progressBar() recursion is stopped')
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
        } 
        const asset = await MediaLibrary.createAssetAsync(cachedVideo.uri);
        return asset;
    };

    let progressBar = (timeleft, timetotal) => {
        if(timeleft > 0 && isRecordingInterrupted.current === false) {
            setProgress(timetotal - timeleft);
            if(timeleft % (recordOptions.maxDuration / TOTAL_SAMPLE_FACE) == 0) {Vibration.vibrate(1000)}
            setTimeout(function() {
                progressBar(timeleft - 1, timetotal);
            }, 1000);
        } else{
            setTimeout(function() {
                setProgress(0);
                setIsRecording(false);
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

      //upload blob to firebase and return download ur
      let uploadToFirebase = (blob) => {
        return new Promise((resolve, reject)=>{
          console.log('blob:\n', JSON.stringify(blob._data.name))
          const usrName = firebase.auth().currentUser.displayName.replace(/\s+/g, '-').toLowerCase();
          const usrUID = firebase.auth().currentUser.uid;
          const currTime = new Date().toISOString().substring(0,19);
          const fullPath = "videos/" + usrName + "-" + usrUID + "/";
          const fileName = currTime + "-" + blob._data.name;    
          var storageRef = firebase.storage().ref(fullPath + fileName);
          var uploadTask = storageRef.put(blob);
          uploadTask.on('state_changed', 
                (snapshot) => {
                    // Observe state change events such as progress, pause, and resume
                    // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                    setUploadProgress(snapshot.bytesTransferred / snapshot.totalBytes * 100);
                    switch (snapshot.state) {
                        case firebase.storage.TaskState.PAUSED: // or 'paused'
                            console.log('Upload is paused');
                            break;
                        case firebase.storage.TaskState.RUNNING: // or 'running'
                            console.log('Upload is running');
                            break;
                    }
                }, 
                (err) => {
                    // Handle unsuccessful uploads
                    reject(err);
                }, 
                () => {
                    // Handle successful uploads on complete
                    setTimeout(()=>{ setUploadProgress(0) }, 3000);
                    uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
                        resolve(downloadURL);
                    });
                }
          );
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
                <Camera ref = {cameraRef}  style={styles.camera} type={type} ratio="4:3">
                
                    <View style={{flex:1}}>
                        <ImageBackground source={require('../../assets/sampleFaces/oval4.png')} style={styles.overlayStyle}>
                            <View style={{ flex: 3, backgroundColor: "transparent",  flexDirection:"row" }}>
                                <View style={{ flex: 1}}>  
                                    {progress < recordOptions.maxDuration * 1 / TOTAL_SAMPLE_FACE ? <Image style={styles.imageStyle} source={require('../../assets/sampleFaces/facial-expression-one.png')}/> : <></>}
                                    {progress < recordOptions.maxDuration * 2 / TOTAL_SAMPLE_FACE && progress >= recordOptions.maxDuration * 1 / TOTAL_SAMPLE_FACE ?  <Image style={styles.imageStyle} source={require('../../assets/sampleFaces/facial-expression-two.png')}/> : <></>}
                                    {progress < recordOptions.maxDuration * 3 / TOTAL_SAMPLE_FACE && progress >= recordOptions.maxDuration * 2 / TOTAL_SAMPLE_FACE ?  <Image style={styles.imageStyle} source={require('../../assets/sampleFaces/facial-expression-three.png')}/> : <></>}
                                    {progress < recordOptions.maxDuration * 4 / TOTAL_SAMPLE_FACE && progress >= recordOptions.maxDuration * 3 / TOTAL_SAMPLE_FACE ?  <Image style={styles.imageStyle} source={require('../../assets/sampleFaces/facial-expression-four.png')}/> : <></>}
                                    {progress < recordOptions.maxDuration * 5 / TOTAL_SAMPLE_FACE && progress >= recordOptions.maxDuration * 4 / TOTAL_SAMPLE_FACE ?  <Image style={styles.imageStyle} source={require('../../assets/sampleFaces/facial-expression-five.png')}/> : <></>}
                                    {progress < recordOptions.maxDuration * 6 / TOTAL_SAMPLE_FACE && progress >= recordOptions.maxDuration * 5 / TOTAL_SAMPLE_FACE ?  <Image style={styles.imageStyle} source={require('../../assets/sampleFaces/facial-expression-six.png')}/> : <></>}
                                    {progress < recordOptions.maxDuration * 7 / TOTAL_SAMPLE_FACE && progress >= recordOptions.maxDuration * 6 / TOTAL_SAMPLE_FACE ?  <Image style={styles.imageStyle} source={require('../../assets/sampleFaces/facial-expression-seven.png')}/> : <></>}
                                    {progress < recordOptions.maxDuration * 8 / TOTAL_SAMPLE_FACE && progress >= recordOptions.maxDuration * 7 / TOTAL_SAMPLE_FACE ?  <Image style={styles.imageStyle} source={require('../../assets/sampleFaces/facial-expression-eight.png')}/> : <></>}
                                </View>
                                <View style={{ flex: 1, backgroundColor: "transparent" }}/>
                                <View style={{ flex: 1, backgroundColor: "transparent" }}/>
                            </View>
                            <View style={{ flex: 5, backgroundColor: "transparent" }} />
                            <View style={{ flex: 1, backgroundColor: "transparent", flexDirection:"row", alignItems: 'center' }} >
                                <View style={{ flex: 1, backgroundColor: "transparent" }}/>
                                <View style={{ flex: 4, backgroundColor: "transparent"}}>
                                    {uploadProgress ===100 ? <Text style={{ fontSize: 20, fontWeight:'bold', color:'white', textAlign:"center", backgroundColor:'black' }}>UPLOAD SUCCESS!</Text> : <></>}
                                    {uploadProgress !== 0 && uploadProgress !== 100 ? <Text style={{ fontSize: 20, fontWeight:'bold', color:'white', textAlign:"center", backgroundColor:'black' }}>UPLOADING...</Text> : <></>}
                                    {uploadProgress !== 0 ? <Progress.Bar progress={uploadProgress} width={null} height={20} color={'red'} borderColor={'black'} borderWidth={3}/> : <></>}
                                </View>
                                <View style={{ flex: 1, backgroundColor: "transparent" }}/>
                            </View>
                        </ImageBackground>
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
                                        //upload blob to firebase and return downloadurl
                                        return uploadToFirebase(blob);
                                    }).then((downloadURL)=>{
                                        console.log('video successfully uploaded to storage!\ndownloadurl: ', downloadURL);
                                        //upload the download url to database
                                        let currTime = new Date().toISOString().substring(0,19);
                                        const fullPath = "users/" + firebase.auth().currentUser.uid + "/downloadUrls"
                                        firebase.database().ref(fullPath).update({[currTime]: downloadURL});
                                        // firebase.database().ref("users/" + firebase.auth().currentUser.uid).set({"profileUrl": downloadURL});
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
        flex: 1,
        alignSelf: 'center',
        height:'95%', 
        width:'95%',
        borderRadius: 150 / 4,
        marginLeft:10,
        marginTop:10,
        borderColor:'white',
        borderWidth:1,
    },
    overlayStyle:{
        flex: 1,
        alignSelf: 'center',
        height:'100%', 
        width:'100%',
        // borderRadius: 150 / 4,
        marginLeft:10,
        marginTop:10,
        // borderColor:'white',
        // borderWidth:1,
    }
  });

  const recordOptions = {
      maxDuration: 8,
      mute: true,
  }

  const TOTAL_SAMPLE_FACE = 8;

  const encodingOptions = {
      encoding: FileSystem.EncodingType.Base64,
  }