/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import { Keyboard,  Text, View, TouchableOpacity, TextInput, StyleSheet,ListView,AppRegistry} from 'react-native';
import Toast from 'react-native-simple-toast';

var Sound = require('react-native-sound');
var whoosh = new Sound('bell.mp3', Sound.MAIN_BUNDLE, (error) => {
  if (error) {
    console.log('failed to load the sound', error);
    return;
  } 
  // loaded successfully
  console.log('duration in seconds: ' + whoosh.getDuration() + 'number of channels: ' + whoosh.getNumberOfChannels());
});

var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

export default class issues extends Component {
  state = {
     repo: '',
     names: ds
  }
  handleRepo = (text) => {
     this.setState({ repo: text })
  }

  sendRepo = (repo) => {
     ft = "https://api.github.com/repos/"+ repo + "/issues"
     fetch(ft)
     .then(response => {
        if (response.status == 404) {
           whoosh.play();
           Toast.show('Repository not found.', Toast.LONG);
           this.setState({ 
              names : ds.cloneWithRows([])
           });
           throw Error(response.statusText);
        }

        return response.json()

     })
     .then(json => {
      console.log(json.length)
       if (json.length == 0) {
        whoosh.play();
        Toast.show('No Issues found', Toast.LONG);
       }
       Keyboard.dismiss()
       this.setState({
         names : ds.cloneWithRows(json)
       });
     })
     .catch(function(error) {
       
   });
  }
  alertItemName = (item) => {
     console.log(state)
     alert(item.title)
  }

  render() {
     return (
        <View style = {styles.mainbox}>
           <View style = {styles.container2}>
              <TextInput style = {styles.input}
                 underlineColorAndroid = "transparent"
                 placeholder = "Enter Repository..."
                 placeholderTextColor = "#9a73ef"
                 autoCapitalize = "none"
                 onChangeText = {this.handleRepo}/>
                 
              <TouchableOpacity
                 style = {styles.submitButton}
                 onPress = { () => this.sendRepo(this.state.repo)}>
                 <Text style = {styles.submitButtonText}>
                    Search
                 </Text>
              </TouchableOpacity>
           </View>
           <View>   
              <ListView
                       enableEmptySections={true}
                      dataSource={this.state.names}
                      renderRow={(item) => 
                       <View style = {[styles.container, {backgroundColor: (item.state=="open") ?  "#d9f9b1" : "#ec7979"}]}>
                          <Text style={styles.text}>
                             {item.title}
                          </Text>
                          <Text style= {styles.bottomtext}>
                             {"#"+item.number + " opened by " +item.user.login + " on "+ new Date(item.created_at).toString().slice(0,15)}
                          </Text>
                       </View>}
                    />
           </View>

        </View>   
     )
  }
}


const styles = StyleSheet.create ({
   container: {
      padding: 10,
      marginTop: 3,
   },
   text: {
      fontWeight: "bold",
      fontSize: 18,
      color: '#4f603c'
   },
   bottomtext: {
      fontSize: 12,
      color: '#4f603c'
   },
   container2: {
      paddingTop: 0,
      flexDirection:'row' 
   },
   
   input: {
    fontSize: 16,
      height: 50,
      flex:0.8,
      borderColor: '#7a42f4',
      borderWidth: 1
   },
   
   submitButton: {
      backgroundColor: '#7a42f4',
      height: 50,
      flex:0.2,
    justifyContent: 'center',
    alignItems: 'center'
   },
   
   submitButtonText:{
    fontWeight: "bold",
      fontSize: 18,
      color: 'white',
     textAlign: 'center',

   },
   mainbox:{
      flex: 1,
      marginBottom:50,
   }
})

AppRegistry.registerComponent('issues', () => issues);
