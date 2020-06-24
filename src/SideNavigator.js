//This is an example code for NavigationDrawer//
import React, { Component } from 'react';
//import react in our code.
import { View, Image, SafeAreaView, ScrollView, TouchableOpacity, ImageBackground, StyleSheet, Text, Dimensions, Modal } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
// import all basic components

//Import React Navigation
import {createAppContainer, NavigationActions, DrawerItems, createSwitchNavigator} from 'react-navigation';
import {createBottomTabNavigator} from 'react-navigation-tabs';
import {createDrawerNavigator} from 'react-navigation-drawer';
import {createStackNavigator} from 'react-navigation-stack';

//Import external files
import ExportScreen from './pages/ExportProject/ExportScreen';
import AddToSequenceScreen from './pages/ExportProject/AddToSequenceScreen';
import SelectMoodScreen from './pages/ExportProject/SelectMoodScreen';
import MergeVideoScreen from './pages/ExportProject/MergeVideoScreen';

import CameraScreen from './pages/CameraFeed/CameraScreen';
import SelectProjectScreen from './pages/SelectProject/SelectProjectScreen';
import NewProjectScreen from './pages/NewProject/NewProjectScreen';
import ViewExportedProjectScreen from './pages/ViewExportedProject/ViewExportedProjectScreen';

import {SelectProjectString, AddToSequenceString, ExportString, MergeVideoString, SelectMoodString, NewProjectString, ViewExportedProjectString} from './HelpStrings';

import drawerContentComponents from './drawerContentComponents';

const { width } = Dimensions.get("window");

class NavigationDrawerStructure extends Component {
  //Structure for the navigation Drawer
  toggleDrawer = (props) => {
    //Props to open/close the drawer
    this.props.navigation.toggleDrawer();
  };

  navigate = (props) => {
      //Props to open/close the drawer
      console.log("navigate", this.props.navigation.state.params)
  };

  render() {
    return (
      <View style={{ flexDirection: 'row' }}>
        <TouchableOpacity onPress={this.toggleDrawer.bind(this)}>
          {/*Donute Button Image */}
          <Ionicons
              name="md-menu"
              color="black"
              size={30 * Dimensions.get("window").width/411}
              style={{padding:20, margin:0}}
          />
        </TouchableOpacity>
      </View>
    );
  }
}

class NavigationHelpStructure extends Component {
      state = {
        isVisible: false
      };

    // hide show modal
    displayModal(){
      this.setState({isVisible: !this.state.isVisible})
    }

  navigate = (props) => {
      //Props to open/close the drawer
      console.log("navigate", this.props.navigation.state.params)
  };

  render() {
    return (
          <View style = { styles.container }>
            <Modal
                animationType = {"slide"}
                transparent={false}
                visible={this.state.isVisible}
                onRequestClose={() => {
                  Alert.alert('Modal has now been closed.');
                }}>
                  <ScrollView>
                  {this.props.navigation.state.routeName === "ExportScreen2_Stack" &&
                  <Text style = { styles.text }>
                      {AddToSequenceString}</Text>}

                  {this.props.navigation.state.routeName === "ExportScreen_Stack" &&
                  <Text style = { styles.text }>
                      {ExportString}</Text>}

                  {this.props.navigation.state.routeName === "ExportScreen4_Stack" &&
                  <Text style = { styles.text }>
                      {MergeVideoString}</Text>}

                  {this.props.navigation.state.routeName === "ExportScreen3_Stack" &&
                  <Text style = { styles.text }>
                      {SelectMoodString}</Text>}

                  {this.props.navigation.state.routeName === "NewProjectScreen_Stack" &&
                  <Text style = { styles.text }>
                      {NewProjectString}</Text>}

                  {this.props.navigation.state.routeName === "SelectProjectScreen_Stack" &&
                  <Text style = { styles.text }>
                      {SelectProjectString}</Text>}

                  {this.props.navigation.state.routeName === "ViewExportedProjectScreen_Stack" &&
                  <Text style = { styles.text }>
                      {ViewExportedProjectString}</Text>}

                  <Text
                    style={styles.closeText}
                    onPress={() => {
                      this.displayModal(!this.state.isVisible);}}>Close</Text>
                      </ScrollView>
              </Modal>
              <View style={{ flexDirection: 'row' }}>
                <TouchableOpacity onPress={this.displayModal.bind(this)}>
                  {/*Donute Button Image */}
                  <Ionicons
                      name="md-help-circle"
                      color="black"
                      size={30 * Dimensions.get("window").width/411}
                      style={{padding:5, margin:0}}
                  />
                </TouchableOpacity>
              </View>
        </View>
    );
  }
}

class NavigationBackStructure extends Component {
  //Structure for the navigation Drawer
  goBack = (props) => {
    //Props to open/close the drawer
    this.props.navigation.goBack();
  };

  navigate = (props) => {
      //Props to open/close the drawer
      console.log("navigate", this.props.navigation.state.params)
  };

  render() {
    return (
      <View style={{ flexDirection: 'row' }}>
        <TouchableOpacity onPress={this.goBack.bind(this)}>
          {/*Donute Button Image */}
          <Ionicons
              name="md-arrow-back"
              color="black"
              size={30 * Dimensions.get("window").width/411}
              style={{padding:20, margin:0}}
          />
        </TouchableOpacity>
      </View>
    );
  }
}

const CameraScreen_StackNavigator = createStackNavigator({
  CameraScreen_Stack: {
    screen: CameraScreen,
    navigationOptions: ({ navigation }) => ({
      title: 'Camera Screen',
      headerLeft: ()=> <NavigationBackStructure navigation={navigation} />,
      headerRight: ()=> <NavigationHelpStructure navigation={navigation} />,
      headerShown: false,
    }),
   },
});

const SelectProjectScreen_StackNavigator = createStackNavigator({
  SelectProjectScreen_Stack: {
    screen: SelectProjectScreen,
    navigationOptions: ({ navigation }) => ({
      title: 'Select Project',
      headerStyle: {
        backgroundColor: 'transparent',
      },
      headerTintColor: 'black',
      headerTitleAlign: { alignSelf: 'center' },
      headerRight: ()=> <NavigationHelpStructure navigation={navigation} />,
    }),
  },
});

const NewProjectScreen_StackNavigator = createStackNavigator({
  NewProjectScreen_Stack: {
//    screen: NewProjectScreen,
    screen: (props) => <NewProjectScreen {...props} />,
    navigationOptions: ({ navigation }) => ({
      title: 'Create New Project',
      headerStyle: {
        backgroundColor: 'transparent',
      },
      headerTitleAlign: { alignSelf: 'center' },
      headerTintColor: 'black',
      headerRight: ()=> <NavigationHelpStructure navigation={navigation} />,
    }),
    params: ({ navigation }) => (navigation.state.params),
  },
});

const ExportScreen_StackNavigator = createStackNavigator({
  ExportScreen_Stack: {
    screen: ExportScreen,
    navigationOptions: ({ navigation }) => ({
      title: 'Export Project: ' + navigation.state.params.title,
      headerRight: ()=> <NavigationHelpStructure navigation={navigation} />,
      headerStyle: {
        backgroundColor: 'transparent',
      },
      headerTitleAlign: { alignSelf: 'center' },
      headerTintColor: 'black',
    }),
  },
  ExportScreen2_Stack: {
      screen: AddToSequenceScreen,
      navigationOptions: ({ navigation }) => ({
        title: 'Add To Sequence: ' + navigation.state.params.title,
        headerLeft: ()=> <NavigationBackStructure navigation={navigation} />,
        headerRight: ()=> <NavigationHelpStructure navigation={navigation} />,
        headerStyle: {
          backgroundColor: 'transparent',
        },
      headerTitleAlign: { alignSelf: 'center' },
        headerTintColor: 'black',
      }),
    },
  ExportScreen3_Stack: {
      screen: SelectMoodScreen,
      navigationOptions: ({ navigation }) => ({
        title: 'Select Mood: ' + navigation.state.params.title,
        headerLeft: ()=> <NavigationBackStructure navigation={navigation} />,
        headerRight: ()=> <NavigationHelpStructure navigation={navigation} />,
        headerStyle: {
          backgroundColor: 'transparent',
        },
      headerTitleAlign: { alignSelf: 'center' },
        headerTintColor: 'black',
      }),
    },
  ExportScreen4_Stack: {
      screen: MergeVideoScreen,
      navigationOptions: ({ navigation }) => ({
        title: 'Merging Sequences',
        headerLeft: ()=> <NavigationBackStructure navigation={navigation} />,
      headerRight: ()=> <NavigationHelpStructure navigation={navigation} />,
      headerStyle: {
        backgroundColor: 'transparent',
      },
      headerTitleAlign: { alignSelf: 'center' },
        headerTintColor: 'black',
      }),
    },
});

const ViewExportedProjectScreen_StackNavigator = createStackNavigator({
  ViewExportedProjectScreen_Stack: {
    screen: ViewExportedProjectScreen,
    navigationOptions: ({ navigation }) => ({
      title: 'View Exported Project',
      headerStyle: {
        backgroundColor: 'transparent',
      },
      headerTitleAlign: { alignSelf: 'center' },
      headerTintColor: 'black',
      headerRight: ()=> <NavigationHelpStructure navigation={navigation} />,
    }),
  },
});

export const BottomNavigator = createBottomTabNavigator({
      //Drawer Optons and indexing
      CameraScreen: {
        //Title
        screen: CameraScreen_StackNavigator,
        navigationOptions: {
          drawerLabel: 'Camera Screen',
          title: 'Camera',
            tabBarIcon: ({ focused, tintColor }) => {
                return <Ionicons name="md-camera" size={30} color={tintColor} />;
            },
            tabBarVisible:false,
        },
      },
      SelectProjectScreen: {
        //Title
        screen: SelectProjectScreen_StackNavigator,
        navigationOptions: {
          drawerLabel: 'Select Project',
          title: 'Select',
            tabBarIcon: ({ focused, tintColor }) => {
                return <Ionicons name="md-folder-open" size={35} color={tintColor} />;
            },
        },
      },
      NewProjectScreen: {
        //Title
        screen: NewProjectScreen_StackNavigator,
        navigationOptions: {
          drawerLabel: 'New Project',
          title: 'New Project',
            tabBarIcon: ({ focused, tintColor }) => {
                return <Ionicons name="md-add" size={31} color={tintColor} />;
            },
        },
      },
      ExportScreen: {
        //Title
        screen: ExportScreen_StackNavigator,
        navigationOptions: {
          drawerLabel: 'Export Project',
          title: 'Export',
            tabBarIcon: ({ focused, tintColor }) => {
                return <AntDesign name="upload" size={25} color={tintColor} />;
            },
        },
      },
      ViewExportedProjectScreen: {
        //Title
        screen: ViewExportedProjectScreen_StackNavigator,
        navigationOptions: {
          drawerLabel: 'View Exported Project',
          title: 'Result',
            tabBarIcon: ({ focused, tintColor }) => {
                return <Ionicons name="md-eye" size={30} color={tintColor} />;
            },
        },
      },
    },
       {
        tabBarOptions: {
          activeTintColor: 'blue',
          inactiveTintColor: 'gray',
            style: {
                backgroundColor: 'transparent',
                height: 50,
            }
        }
       });


export const DashboardStackNavigator = createStackNavigator(
         {
           BottomNavigator: BottomNavigator
         },
         {
           defaultNavigationOptions: ({ navigation }) => {
             return {
               headerShown: false,
             };
           }
         }
       );

const AppDrawerNavigator = createDrawerNavigator({
  Dashboard: {
    screen: DashboardStackNavigator
  }
},
        {
                 contentComponent: drawerContentComponents,
                  drawerWidth: (width / 3) * 2
        });

export const SwitchNavigator = createSwitchNavigator({
         Dashboard: { screen: AppDrawerNavigator },
       });

       const styles = StyleSheet.create({
         container: {
           padding: 25,
           flex: 1,
           alignItems: 'center',
           justifyContent: 'center',
         },
         button: {
           display: 'flex',
           height: 60,
           borderRadius: 6,
           justifyContent: 'center',
           alignItems: 'center',
           width: '100%',
           backgroundColor: '#2AC062',
           shadowColor: '#2AC062',
           shadowOpacity: 0.5,
           shadowOffset: {
             height: 10,
             width: 0
           },
           shadowRadius: 25,
         },
         closeButton: {
           display: 'flex',
           height: 60,
           borderRadius: 6,
           justifyContent: 'center',
           alignItems: 'center',
           backgroundColor: '#FF3974',
           shadowColor: '#2AC062',
           shadowOpacity: 0.5,
           shadowOffset: {
             height: 10,
             width: 0
           },
           shadowRadius: 25,
         },
         buttonText: {
           color: '#FFFFFF',
           fontSize: 22,
         },
         image: {
           marginTop: 150,
           marginBottom: 10,
           width: '100%',
           height: 350,
         },
         text: {
           fontSize: 15,
           padding: 40,
           alignSelf: 'center',
         },
         closeText: {
           fontSize: 24,
           color: '#00479e',
           textAlign: 'center',
           marginBottom: 50,
         }
       });