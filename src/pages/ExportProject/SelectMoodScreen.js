import React, { Component } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  Button,
  View,
  Dimensions,
  ScrollView,
  Image,
  Alert,
} from "react-native";
import Video, { FilterType } from "react-native-video";
import RNFS from "react-native-fs";
import GestureRecognizer, {
  swipeDirections,
} from "react-native-swipe-gestures";

import AsyncStorage from "@react-native-community/async-storage";
import { SetItem } from "../../storage_management/Storage";

import styles from "./styles";

import {widthRatio, heightRatio} from "../../HelpStrings"

const { width: winWidth, height: winHeight } = Dimensions.get("window");

export default class SelectMoodScreen extends Component {
  constructor(props) {
    super(props);
    this.loadSequences();
    this.listener = this.props.navigation.addListener(
      "willFocus",
      this.loadSequences
    );
  }

 loadSequences = async () => {
    await AsyncStorage.getItem("project_name")
      .then((a) => {
        if (a === "" || a === null) {
          //no project yet, redirect to new project page
          this.props.navigation.navigate({
            type: "Navigate",
            routeName: "NewProjectScreen",
            params: { ...this.props.navigation.state.params },
          });
        }
        this.setState({ project_name: a });
      })
      .catch((err) => {
        console.log(err.message);
      });
    if (this.state.project_name != "" && this.state.project_name != null) {
      await AsyncStorage.getItem("project_data")
        .then((a) => {
          var project_data = JSON.parse(a);
          this.setState({ project_data: project_data });
          if (project_data.project_sequence != null) {
            this.setState({ captures: project_data.project_sequence });
          } else {
            this.setState({ captures: [] });
          }

          if (project_data.project_mood != null) {
            this.setState({ mood: project_data.project_mood });
          } else {
            this.setState({ mood: "" });
          }

          if (project_data.project_format != null) {
            this.setState({ format: project_data.project_format });
          } else {
            this.setState({ format: "" });
          }
        })
        .catch((err) => {
          console.log(err.message);
        });
    }
  };

  componentWillUnmount() {
    this.listener.remove();
  }

  state = {
    captures: [],
    project_data: {},
    project_name: "",
    mood: "",
    format: "",
  };

  setMood = (mood) => {
      if (mood === this.state.mood) {
        mood = "";
      }
    this.setState({ mood }, function () {
          var added_project_data = this.state.project_data;
          added_project_data.project_mood = this.state.mood;
          this.setState({ project_data: added_project_data });
          //update project_data
          try {
            AsyncStorage.setItem(
              "project_data",
              JSON.stringify(added_project_data)
            );
            SetItem(
              "document",
              this.state.project_name + ".txt",
              "Project",
              added_project_data
            );
          } catch (err) {
            console.log(err);
          }
    });
  };

  setFormat = (format) => {
      if (format === this.state.format) {
        format = "";
      }
    this.setState({ format }, function () {
          var added_project_data = this.state.project_data;
          added_project_data.project_format = this.state.format;
          this.setState({ project_data: added_project_data });
          //update project_data
          try {
            AsyncStorage.setItem(
              "project_data",
              JSON.stringify(added_project_data)
            );
            SetItem(
              "document",
              this.state.project_name + ".txt",
              "Project",
              added_project_data
            );
          } catch (err) {
            console.log(err);
          }
    });

  };

  navigateToMergeVideos = (props) => {
      //checking if media > 2
      if (this.state.mood === "" || this.state.format === ""){
          Alert.alert(
            "Warning",
            "You have to select mood and format!",
            [
              {text: "OK"}
            ],
            { cancelable: true }
          );
      } else {
        this.props.navigation.navigate({
          type: "Navigate",
          routeName: "ExportScreen4_Stack",
          params: { ...this.props.navigation.state.params },
        });
    }
  };

  render() {
    return (
      <React.Fragment>
        <View style={{ alignItems: "center", flexGrow: 1}}>

        <View style={{ alignItems: "center", top: heightRatio*50}}>
        <View>
        <View style={{ alignItems: "center" }}>
        <Text style={{fontSize: 20}}> Select Mood: {this.state.mood} </Text>
        </View>
          <View style={{ alignItems: "center" }}>
            <TouchableOpacity
              style={styles.addToSequenceButton}
              onPress={() => this.setMood("Summer Vibes")}
            >
              <Text style={styles.buttonText}> Summer Vibes </Text>
            </TouchableOpacity>
          </View>
          <View style={{ alignItems: "center" }}>
            <TouchableOpacity
              style={styles.addToSequenceButton}
              onPress={() => this.setMood("Action")}
            >
              <Text style={styles.buttonText}> Action </Text>
            </TouchableOpacity>
          </View>
          <View style={{ alignItems: "center"}}>
            <TouchableOpacity
              style={styles.addToSequenceButton}
              onPress={() => this.setMood("Adventure")}
            >
              <Text style={styles.buttonText}> Adventure </Text>
            </TouchableOpacity>
          </View>
           </View>

          <View style={{ alignItems: "center", top:heightRatio*50 }}>
          <View style={{ alignItems: "center" }}>
        <Text style={{fontSize: 20}}> Select Format: {this.state.format} </Text>
        </View>
          <View style={{ alignItems: "center" }}>
            <TouchableOpacity
              style={styles.addToSequenceButton}
              onPress={() => this.setFormat("Instagram Story")}
            >
              <Text style={styles.buttonText}> Instagram Story </Text>
            </TouchableOpacity>
          </View>
          <View style={{ alignItems: "center" }}>
            <TouchableOpacity
              style={styles.addToSequenceButton}
              onPress={() => this.setFormat("YouTube")}
            >
              <Text style={styles.buttonText}> YouTube </Text>
            </TouchableOpacity>
          </View>
          </View>
          </View>

          <View
            style={{
              position: 'absolute',
              alignItems: "center",
              width: winWidth,
              bottom: 0,
            }}
          >
            <TouchableOpacity style={styles.addToSequenceButton}
              onPress={this.navigateToMergeVideos}>
              <Text style={styles.buttonText}> Export </Text>
            </TouchableOpacity>
          </View>
        </View>
      </React.Fragment>
    );
  }
}
