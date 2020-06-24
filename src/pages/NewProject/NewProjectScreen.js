import React, { Component } from 'react'
import { View, Text, TouchableOpacity, TextInput, StyleSheet } from 'react-native'

import AsyncStorage from '@react-native-community/async-storage';
import {SetItem, CheckItem} from "../../storage_management/Storage"

import {widthRatio, heightRatio} from "../../HelpStrings"

class Inputs extends Component {
   textInput;
   state = {
      name: '',
      errorText: '',
   }
   handleName = (text) => {
      this.setState({ name: text })
   }

   createProject = async (name) => {
      if (this.state.name === ''||this.state.name==='undefined'){
                this.setState({errorText: "Please insert new project name."})
      }else{
      //check if project already exists
      await CheckItem("document", "Project/"+this.state.name+".txt").then((a) => {
          if (a){
              // name already exists
                this.setState({errorText: "Project "+this.state.name+" already exists. Please insert new project name."})
          } else {
              //okay to create project
            var latest_project = this.state.name
            var project_data = {project_name: latest_project}
            // load latest project
            this.setState({name: '', errorText: ''})
            this.textInput.clear();

            //update latest note
            var latest_state = {latest_project: latest_project};
            SetItem("document", "latest_state.txt", "", latest_state).catch((err) => {
              console.log(err.message);
            })
             try {
                AsyncStorage.setItem('project_name', latest_project);
                AsyncStorage.setItem('project_data', JSON.stringify(project_data));
             } catch (err) {
                console.warn(err);
             }
            SetItem("document", latest_project+".txt", "Project", project_data).then(() => {
              this.props.navigation.navigate({
                  type: "Navigate",
                  routeName: "ExportScreen_Stack",
                  params: {...this.props.navigation.state.params, title: project_data.project_name}
              });
            }).catch((err) => {
              console.log(err.message);
            })

          }
      }).catch((err) => {
        console.log(err.message);
      })
      }
   }

   render() {
      return (
         <View style = {styles.container}>
            <Text style = {styles.inputText}>New project name:</Text>
            <TextInput style = {styles.input}
               underlineColorAndroid = "transparent"
               placeholder = "Insert your project name here"
               placeholderTextColor = "#76c4be"
               autoCapitalize = "none"
               onChangeText = {this.handleName}
               ref={input => { this.textInput = input }}/>
            
            <TouchableOpacity
               style = {styles.submitButton}
               onPress = {
                  () => this.createProject(this.state.name)
               }>
               <Text style = {styles.submitButtonText}> Submit </Text>
            </TouchableOpacity>
            <Text style = {styles.errorText}>{this.state.errorText}</Text>
         </View>
      )
   }
}
export default Inputs

const styles = StyleSheet.create({
   container: {
      paddingTop: heightRatio*35
   },
   input: {
      margin: 10,
      height: heightRatio*70,
      borderColor: '#7a42f4',
      borderWidth: 1,
      padding: 10,
   },
   inputText: {
         margin: 12,
         height: heightRatio*40,
   },
   submitButton: {
      backgroundColor: '#7a42f4',
      padding: 10,
      margin: 10,
      height: heightRatio*65,
   },
   submitButtonText:{
      color: 'white'
   },
   errorText: {
     margin: 12,
     height: heightRatio*40,
     color: 'red',
   },
})