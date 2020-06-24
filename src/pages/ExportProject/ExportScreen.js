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

import {widthRatio, heightRatio} from "../../HelpStrings"

import styles from "./styles";

const { width: winWidth, height: winHeight } = Dimensions.get("window");

export default class ExportScreen extends Component {
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
        })
        .catch((err) => {
          console.log(err.message);
        });
    }

    if (this.state.deletedIndex > -1) {
      var deletedArray = this.state.captures;
      deletedArray.splice(this.state.deletedIndex, 1);
      var newIndex = Math.min(Math.max(this.state.index, deletedArray.length - 1), 0)
      this.setState({captures: deletedArray, deletedIndex: -1, index: newIndex});
    }

    var selectedMediaToAdd = this.props.navigation.getParam(
      "selectedMediaToAdd",
      ""
    );
    if (selectedMediaToAdd != "") {
      if (selectedMediaToAdd.node.image.uri != "") {

      var finalVideoUri = selectedMediaToAdd.node.image.uri
//      if (finalVideoUri.includes("ph://")) {
//          const appleId = selectedMediaToAdd.node.image.uri.substring(5, 41);
//          const fileNameLength = selectedMediaToAdd.node.image.filename.length;
//          const ext = selectedMediaToAdd.node.image.filename.substring(fileNameLength - 3);
//          finalVideoUri = "assets-library://asset/asset."+ext+"?id="+appleId+"&ext="+ext;
//      }

        var addedType = "photo";
        selectedMediaToAdd.node.type.includes("video")
          ? (addedType = "video")
          : (addedType = "photo");
        if (this.state.index === 0) {
          this.setState({
            captures: [
              ...this.state.captures.slice(0, 1),
              {
                type: addedType,
                uri: finalVideoUri,
              },
              ...this.state.captures.slice(1),
            ],
          });
        } else if (this.state.index === this.state.captures.length - 1) {
          this.setState({
            captures: [
              ...this.state.captures,
              {
                type: addedType,
                uri: finalVideoUri,
              },
            ],
          });
        } else {
          this.setState({
            captures: [
              ...this.state.captures.slice(0, this.state.index),
              {
                type: addedType,
                uri: finalVideoUri,
              },
              ...this.state.captures.slice(this.state.index),
            ],
          });
        }
      }
      this.props.navigation.setParams({ selectedMediaToAdd: "" });
    }
          var added_project_data = this.state.project_data;
          added_project_data.project_sequence = this.state.captures;
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
  };

  componentWillUnmount() {
    this.listener.remove();
  }

  state = {
    resizeMode: "contain",
    paused: false,
    index: 0,
    deletedIndex: -1,
    captures: [],
    project_data: {},
    project_name: "",
  };

  player = {};

  onSwipeRight(gestureState) {
    if (this.state.index != 0) {
      this.setState({ index: this.state.index - 1 });
    }
  }

  onSwipeLeft(gestureState) {
    if (this.state.index < this.state.captures.length - 1) {
      this.setState({ index: this.state.index + 1 });
    }
  }

  setIndex = (index) => {
    if (index === this.state.index) {
      index = null;
    }
    this.setState({ index });
  };

     deleteSequenceAlert = () => {
        if (this.state.index != null) {
            Alert.alert(
              "Warning",
              "Are you sure you want to delete current selected media from sequences?",
              [
                {
                  text: "Cancel",
                  style: "cancel"
                },
                {text: "OK", onPress: () => {this.setState({ deletedIndex: this.state.index }); this.loadSequences()}}
              ],
              { cancelable: true }
            );
        }
     }

  navigateToAddSequence = (props) => {
    this.props.navigation.navigate({
      type: "Navigate",
      routeName: "ExportScreen2_Stack",
      params: { ...this.props.navigation.state.params, title: this.state.project_name},
    });
  };

  navigateToSelectMood = (props) => {
    //checking if media > 2
    if (this.state.captures === null || this.state.captures.length < 2){
        Alert.alert(
          "Warning",
          "You have to select more than one media to merge",
          [
            {text: "OK"}
          ],
          { cancelable: true }
        );
    } else {
        this.props.navigation.navigate({
          type: "Navigate",
          routeName: "ExportScreen3_Stack",
          params: { ...this.props.navigation.state.params, title: this.state.project_name },
        });
    }
  };

  render() {
    const config = {
      velocityThreshold: 0.3,
      directionalOffsetThreshold: 80,
    };

    var sequence_length = this.state.captures.length;
    var finishedUri = ""
    if (this.state.captures.length>0 && this.state.index != null) {
    this.state.captures[this.state.index].uri
      if (finishedUri.includes("ph://")) {
          const appleId = finishedUri.substring(5, 41);
          finishedUri = "assets-library://asset/asset."+"mov"+"?id="+appleId+"&ext="+"mov";
      }
      }
    return (
      <React.Fragment>
          <View style={{
            flexGrow: 1,
            justifyContent: 'space-between'
        }}>
        <View style={styles.container}>
          <GestureRecognizer
            onSwipeLeft={(state) => this.onSwipeLeft(state)}
            onSwipeRight={(state) => this.onSwipeRight(state)}
            config={config}
            style={styles.fullScreen}
          >
            {sequence_length > 0 && this.state.index != null &&
              this.state.captures[this.state.index].type === "video" && (
                <Video
                  source={{ uri: finishedUri}}
                  style={styles.fullScreen}
                  paused={this.state.paused}
                  resizeMode={this.state.resizeMode}
                  onLoad={() => {
                    this.player.seek(1);
                  }}
                  repeat={true}
                  ref={(ref) => (this.player = ref)}
                />
              )}

            {sequence_length > 0 && this.state.index != null &&
              this.state.captures[this.state.index].type === "photo" && (
                <Image
                  source={{ uri: this.state.captures[this.state.index].uri }}
                  style={styles.fullScreen}
                  resizeMode={this.state.resizeMode}
                />
              )}
          </GestureRecognizer>
        </View>

        <View>
          <ScrollView horizontal={true} style={[styles.galleryContainer]}>
            {this.state.captures.length > 0 &&
              this.state.captures.map(({ uri, type, thumbnail }, idx) =>
                type === "photo" || Platform.OS === "android" ? (
                  idx === this.state.index ? (
                    <View
                      style={styles.selectedGalleryImageContainer}
                      key={idx}
                    >
                      <TouchableOpacity onPress={() => this.setIndex(idx)}>
                        <Image
                          source={{ uri }}
                          style={styles.selectedGalleryImage}
                        />
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <View style={styles.galleryImageContainer} key={idx}>
                      <TouchableOpacity onPress={() => this.setIndex(idx)}>
                        <Image source={{ uri }} style={styles.galleryImage} />
                      </TouchableOpacity>
                    </View>
                  )
                ) : (
                  <View style={styles.galleryImageContainer} key={idx}>
                    <TouchableOpacity onPress={() => this.setIndex(idx)}>
                      <Image
                        source={{ uri: thumbnail }}
                        style={styles.galleryImage}
                      />
                    </TouchableOpacity>
                  </View>
                )
              )}
          </ScrollView>
        </View>

        <View style={{ alignItems: "center" }}>
          <View style={{ alignItems: "center", bottom: heightRatio*60 }}>
            <TouchableOpacity
              style={styles.addToSequenceButton}
              onPress={this.navigateToAddSequence}
            >
              <Text style={styles.buttonText}> Add Sequence </Text>
            </TouchableOpacity>
          </View>

          <View style={{ alignItems: "center", bottom: heightRatio*85 }}>
            <TouchableOpacity
                style={styles.addToSequenceButton}
                onPress={this.deleteSequenceAlert}
                >
              <Text style={styles.buttonText}> Delete Sequence </Text>
            </TouchableOpacity>
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
              onPress={this.navigateToSelectMood}>
              <Text style={styles.buttonText}> Select Mood </Text>
            </TouchableOpacity>
          </View>
        </View>
        </View>
      </React.Fragment>
    );
  }
}
