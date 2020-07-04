// Code from: https://medium.com/zenofai/object-detection-in-react-native-app-using-aws-rekognition-ebd39b1270c2

import React, {Component} from 'react';
import {
 StyleSheet,
 View,
 Text,
 TextInput,
 Image,
 ScrollView,
 TouchableHighlight,
} from 'react-native';
import ImagePicker from 'react-native-image-picker';
import Amplify, {API} from 'aws-amplify';
 
// Amplify configuration for API-Gateway
// Amplify.configure({
//  API: {
//    endpoints: [
//      {
//        name: 'LabellingAPI',   //your api name
//        endpoint:’<Endpoint-URL>’, //Your Endpoint URL
//      },
//    ],
//  },
// });
 
class App extends Component {
 constructor(props) {
   super(props);
   this.state = {
     username: 'storeImage.png',
     userId: '',
     image: '',
     capturedImage: '',
     objectName: '',
   };
 }
 
// It selects image from filesystem or capture from camera
 captureImageButtonHandler = () => {
   this.setState({
     objectName: '',
   });
 
   ImagePicker.showImagePicker(
     {title: 'Pick an Image', maxWidth: 800, maxHeight: 600},
     response => {
       console.log('Response = ', response);
       if (response.didCancel) {
         console.log('User cancelled image picker');
       } else if (response.error) {
         console.log('ImagePicker Error: ', response.error);
       } else if (response.customButton) {
         console.log('User tapped custom button: ', response.customButton);
       } else {
         // You can also display the image using data:
         const source = {uri: 'data:image/jpeg;base64,' + response.data};
         this.setState({
           capturedImage: response.uri,
           base64String: source.uri,
         });
       }
     },
   );
 };
 
// this method triggers when you click submit. If the image is valid then It will send the image to API Gateway. 
 submitButtonHandler = () => {
   if (
     this.state.capturedImage == '' ||
     this.state.capturedImage == undefined ||
     this.state.capturedImage == null
   ) {
     alert('Please Capture the Image');
   } else {
     const apiName = 'LabellingAPI';
     const path = '/storeimage';
     const init = {
       headers: {
         Accept: 'application/json',
         'Content-Type': 'application/x-amz-json-1.1',
       },
       body: JSON.stringify({
         Image: this.state.base64String,
         name: 'storeImage.png',
       }),
     };
 
     API.post(apiName, path, init).then(response => {
       if (JSON.stringify(response.Labels.length) > 0) {
         this.setState({
           objectName: response.Labels[0].Name,
         });
       } else {
         alert('Please Try Again.');
       }
     });
   }
 };
 
 render() {
   if (this.state.image !== '') {
   }
   return (
     <View style={styles.MainContainer}>
       <ScrollView>
         <Text
           style={{
             fontSize: 20,
             color: '#000',
             textAlign: 'center',
             marginBottom: 15,
             marginTop: 10,
           }}>
           Capture Image
         </Text>
         {this.state.capturedImage !== '' && (
           <View style={styles.imageholder}>
             <Image
               source={{uri: this.state.capturedImage}}
               style={styles.previewImage}
             />
           </View>
         )}
         {this.state.objectName ? (
           <TextInput
             underlineColorAndroid="transparent"
             style={styles.TextInputStyleClass}
             value={this.state.objectName}
           />
         ) : null}
         <TouchableHighlight
           style={[styles.buttonContainer, styles.captureButton]}
           onPress={this.captureImageButtonHandler}>
           <Text style={styles.buttonText}>Capture Image</Text>
         </TouchableHighlight>
 
         <TouchableHighlight
           style={[styles.buttonContainer, styles.submitButton]}
           onPress={this.submitButtonHandler}>
           <Text style={styles.buttonText}>Submit</Text>
         </TouchableHighlight>
       </ScrollView>
     </View>
   );
 }
}
 
const styles = StyleSheet.create({
 TextInputStyleClass: {
   textAlign: 'center',
   marginBottom: 7,
   height: 40,
   borderWidth: 1,
   marginLeft: 90,
   width: '50%',
   justifyContent: 'center',
   borderColor: '#D0D0D0',
   borderRadius: 5,
 },
 inputContainer: {
   borderBottomColor: '#F5FCFF',
   backgroundColor: '#FFFFFF',
   borderRadius: 30,
   borderBottomWidth: 1,
   width: 300,
   height: 45,
   marginBottom: 20,
   flexDirection: 'row',
   alignItems: 'center',
 },
 buttonContainer: {
   height: 45,
   flexDirection: 'row',
   alignItems: 'center',
   justifyContent: 'center',
   marginBottom: 20,
   width: '80%',
   borderRadius: 30,
   marginTop: 20,
   marginLeft: 5,
 },
 captureButton: {
   backgroundColor: '#337ab7',
   width: 350,
 },
 buttonText: {
   color: 'white',
   fontWeight: 'bold',
 },
 horizontal: {
   flexDirection: 'row',
   justifyContent: 'space-around',
   padding: 10,
 },
 submitButton: {
   backgroundColor: '#C0C0C0',
   width: 350,
   marginTop: 5,
 },
 imageholder: {
   borderWidth: 1,
   borderColor: 'grey',
   backgroundColor: '#eee',
   width: '50%',
   height: 150,
   marginTop: 10,
   marginLeft: 90,
   flexDirection: 'row',
   alignItems: 'center',
 },
 previewImage: {
   width: '100%',
   height: '100%',
 },
});

export default App;
