import React, { Component } from 'react';
import ModalDropdown from './ModalDropdown';

import {
  AppRegistry,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Image,
} from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import {SetItem, GetItem, GetItems} from "../../storage_management/Storage"
import AsyncStorage from '@react-native-community/async-storage';
import {widthRatio, heightRatio} from "../../HelpStrings"

const windowWidth = Dimensions.get("window").width
const windowHeight = Dimensions.get("window").height

export default class SelectProjectScreen extends Component {

  constructor(props) {
    super(props);
    console.log(Dimensions.get("window"))
    this.state = {
        value : "Select project",
        options: [],
        errorText: '',
        currentProject: '',
        captures: [],
    }

    this.listener = this.props.navigation.addListener("willFocus", this.componentDidMount.bind(this));
  }

  componentWillUnmount() {
    this.listener.remove();
  }

  componentDidMount(props) {
    this.loadProjectName().then(()=>{
        this.loadProject(this.state.currentProject)
    })
  }

  async loadProjectName() {
      await AsyncStorage.getItem('project_name').then((a) => {
        this.setState({currentProject: a})
      }).catch((err) => {
        console.log(err.message);
      })

     await GetItems("document", "Project").then((a) => {
       this.setState({options: a})
     }).catch((err) => {
       console.log(err.message);
     })
  }

  onSelect(value, label) {
    this.setState({value : label});
  }

  loadProject = async (value) => {
    if (value === ''|| value==='undefined' || value === 'Select project'){
      this.setState({errorText: "Please select a project."})
    } else {
        value = value + ".txt"
        var latest_project = '';
        var project_data = {project_name: ''}
        // load project
        await GetItem("document", "Project/"+value).then((latest_projectData) => {
                // assign latest project data
                if (latest_projectData){
                latest_project = latest_projectData.project_name;
                project_data = latest_projectData;
                 try {
                    AsyncStorage.setItem('project_name', latest_project);
                    AsyncStorage.setItem('project_data', JSON.stringify(project_data));
                 } catch (err) {
                    console.log(err);
                 }
                this.setState({currentProject: latest_project})

                  if (project_data.project_sequence != null) {
                    this.setState({ captures: project_data.project_sequence });
                  } else {
                    this.setState({ captures: [] });
                  }

                 //update latest note
                 var latest_state = {latest_project: latest_project};
                 SetItem("document", "latest_state.txt", "", latest_state).catch((err) => {
                   console.log(err.message);
                 })
                }
        }).catch((err) => {
          console.log(err.message);
        })
    }
 }


  navigateToExport = (props) => {
      if (this.state.currentProject === ''|| this.state.currentProject==='undefined' || this.state.currentProject === 'Select project'){
        this.setState({errorText: "Please select a project."})
      } else {
        this.props.navigation.navigate({
            type: "Navigate",
            routeName: "ExportScreen_Stack",
            params: {...this.props.navigation.state.params, title: this.state.currentProject}
        });
    }
  };

  render() {
    var optionsSelect = [];
    var optionsToListed = this.state.options
    for (let i = 0; i < optionsToListed.length; i++){
        if (optionsToListed[i].name.replace(/\.[^/.]+$/, "") != "null") {
            optionsSelect.push(optionsToListed[i].name.replace(/\.[^/.]+$/, ""))
        }
    }
    return (
    <React.Fragment>
      <View style={styles.container}>
        <View>
        <Text style = {styles.headlineText}>Current project: </Text>
        <Text style = {styles.projectNameText}>"{this.state.currentProject}"</Text>
        </View>

        <View>
          <ScrollView horizontal={true} style={[styles.galleryContainer]}>
            {this.state.captures.length > 0 &&
              this.state.captures.map(({ uri, type, thumbnail }, idx) =>
                type === "photo" || Platform.OS === "android" ? (
                    <View style={styles.galleryImageContainer} key={idx}>
                        <Image source={{ uri }} style={styles.galleryImage} />
                    </View>
                ) : (
                  <View style={styles.galleryImageContainer} key={idx}>
                      <Image
                        source={{ uri: thumbnail }}
                        style={styles.galleryImage}
                      />
                  </View>
                )
              )}
          </ScrollView>
        </View>

        <View style={{alignItems:"center"}}>
        <ModalDropdown
            options = {optionsSelect}
            onSelect = {this.onSelect.bind(this)}
            defaultValue  = {this.state.value}
            style = {styles.dropDownArea}
            textStyle = {{}}
          >
        </ModalDropdown>

      <TouchableOpacity
         style = {styles.submitButton}
         onPress = {
            () => this.loadProject(this.state.value)
         }>
         <Text style = {styles.submitButtonText}> See Sequence </Text>
      </TouchableOpacity>

      <TouchableOpacity
         style = {styles.submitButton}
         onPress = {
            () => this.navigateToExport(this.state.value)
         }>
         <Text style = {styles.submitButtonText}> Load Project </Text>
      </TouchableOpacity>
        <Text style = {styles.errorText}>{this.state.errorText}</Text>
        </View>
      </View>
      </React.Fragment>
    );
  }
}

const styles = EStyleSheet.create({
   container: {
      paddingTop: "20rem"
   },
   headlineText: {
      left: "5%",
      height: "14%",
      fontSize: "24rem",
   },
   projectNameText: {
      top: "10%",
      left: "5%",
      height: "18%",
      fontSize: "19rem",
   },
   dropDownArea: {
      justifyContent: "center",
      top: "-15%",
      height: "12%",
      width: windowWidth/2,
      borderWidth : 1,
      borderColor : "grey",
      margin: 20
   },
   submitButton: {
      top: "-15%",
      backgroundColor: '#7a42f4',
      padding: 10,
      margin: 8,
      height: "10%",
      width: widthRatio*130,
      alignItems: "center",
   },
   submitButtonText:{
      color: 'white'
   },
   errorText: {
     top: heightRatio*-80,
     margin: 12,
     height: "10%",
     color: 'red',
   },
   //slider gallery
  galleryContainer: {
    top: "-30%",
    height: widthRatio*150,
    width: "100%",
  },
  galleryImageContainer: {
    width: widthRatio*150,
    marginRight: widthRatio*5,
  },
  galleryImage: {
    width: "100%",
    height: "100%",
  },
})