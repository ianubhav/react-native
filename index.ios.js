/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import { Text, View, TouchableOpacity, TextInput, StyleSheet,ListView,AppRegistry} from 'react-native';
import Toast from 'react-native-simple-toast';

var Sound = require('react-native-sound');
Sound.setCategory('Playback');

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
                 placeholder = "Enter Repo ..."
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

AppRegistry.registerComponent('issues', () => issues);
