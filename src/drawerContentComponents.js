import React, { Component } from 'react';
import {NavigationActions} from 'react-navigation';
import { Text, View, StyleSheet, ImageBackground, Dimensions } from 'react-native'
import { white } from 'ansi-colors';
import AsyncStorage from "@react-native-community/async-storage";

import EStyleSheet from 'react-native-extended-stylesheet';
import {widthRatio, heightRatio} from "./HelpStrings"

export default class drawerContentComponents extends Component {

    navigateToScreen = ( route ) => (
        async () => {
        //condition export screen project name
        var title = ""
        if (route === "ExportScreen") {
            await AsyncStorage.getItem("project_name")
              .then((a) => {
                if (a === "" || a === null) {
                  //no project yet, redirect to new project page
                    route = "NewProjectScreen"
                } else {
                    title = a
                }
                this.setState({ project_name: a });
        const navigateAction = NavigationActions.navigate({
            routeName: route,
            params: { ...this.props.navigation.state.params, title: a },
        });
        this.props.navigation.navigate(navigateAction);
              })
              .catch((err) => {
                console.log(err.message);
              });
        } else {
            const navigateAction = NavigationActions.navigate({
                routeName: route,
                params: { ...this.props.navigation.state.params },
            });
            this.props.navigation.dispatch(navigateAction);
        }
    })

  render() {
    const pathAndParams = this.props.navigation.router.getPathAndParamsForState(this.props.navigation.state) || {}
    const activePath = pathAndParams.path
    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <ImageBackground
                    source={require('./assets/logo.png')}
                    style={{justifyContent: 'center', width: widthRatio*270, flex: 1}}
                    resizeMode={'cover'}>
                </ImageBackground>
            </View>
            <View style={styles.screenContainer}>
                <View style={[styles.screenStyle, (activePath.includes('CameraScreen')) ? styles.activeBackgroundColor : null]}>
                    <Text style={[styles.screenTextStyle, (activePath.includes('CameraScreen')) ? styles.selectedTextStyle : null]}
                    onPress={this.navigateToScreen('CameraScreen')}>Camera Feed</Text>
                </View>
                <View style={[styles.screenStyle, (activePath.includes('SelectProjectScreen')) ? styles.activeBackgroundColor : null]}>
                    <Text style={[styles.screenTextStyle, (activePath.includes('SelectProjectScreen')) ? styles.selectedTextStyle : null]}
                    onPress={this.navigateToScreen('SelectProjectScreen')}>Select Project</Text>
                </View>
                <View style={[styles.screenStyle, (activePath.includes('NewProjectScreen')) ? styles.activeBackgroundColor : null]}>
                    <Text style={[styles.screenTextStyle, (activePath.includes('NewProjectScreen')) ? styles.selectedTextStyle : null]}
                    onPress={this.navigateToScreen('NewProjectScreen')}>New Project</Text>
                </View>
                <View style={[styles.screenStyle, (activePath.includes('ExportScreen_Stack')) ? styles.activeBackgroundColor : null]}>
                    <Text style={[styles.screenTextStyle, (activePath.includes('ExportScreen_Stack')) ? styles.selectedTextStyle : null]}
                    onPress={this.navigateToScreen('ExportScreen_Stack')}>Export Current Project</Text>
                </View>
                <View style={[styles.screenStyle, (activePath.includes('ViewExportedProjectScreen')) ? styles.activeBackgroundColor : null]}>
                    <Text style={[styles.screenTextStyle, (activePath.includes('ViewExportedProjectScreen')) ? styles.selectedTextStyle : null]}
                    onPress={this.navigateToScreen('ViewExportedProjectScreen')}>View Exported Project</Text>
                </View>
            </View>
        </View>
    )
  }
}

const styles = EStyleSheet.create({
    container: {
        alignItems: 'center',
    },
    headerContainer: {
        height: heightRatio*350,
    },
    headerText: {
        color: '#000000',
        textAlign: 'center',
    },
    screenContainer: {
        width: '100%',
    },
    screenStyle: {
        height: heightRatio*80,
        marginTop: 2,
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%'
    },
    screenTextStyle:{
        fontSize: "20rem",
        marginLeft: widthRatio*20,
        textAlign: 'center'
    },
    selectedTextStyle: {
        fontSize: "20rem",
        marginLeft: widthRatio*20,
        fontWeight: 'bold',
        color: 'blue'
    },
    activeBackgroundColor: {
        backgroundColor: 'grey'
    }
});