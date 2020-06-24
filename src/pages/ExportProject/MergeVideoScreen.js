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
  ActivityIndicator,
} from "react-native";
import Video, { FilterType } from "react-native-video";
import { LogLevel, RNFFmpeg } from "react-native-ffmpeg";
import CameraRoll from "@react-native-community/cameraroll";

import RNFS from "react-native-fs";

import RNFetchBlob from "rn-fetch-blob";
const { fs } = RNFetchBlob;

import AsyncStorage from "@react-native-community/async-storage";
import {
  SetItem,
  SetItemObject,
  GetItem,
  CheckItem,
  RemoveItem,
} from "../../storage_management/Storage";

import styles from "./styles";

import {widthRatio, heightRatio} from "../../HelpStrings"

const { width: winWidth, height: winHeight } = Dimensions.get("window");

export default class MergeVideoScreen extends Component {
  constructor(props) {
    super(props);
    this.loadSequences();
    this.loadSounds();
    this.listener = this.props.navigation.addListener(
      "willFocus",
      this.loadSequences
    );
  }

  loadSounds = async () => {
    switch (this.state.mood) {
      case "Action":
        await CheckItem("cache", "sounds/SupermanTheme.mp3")
          .then((a) => {
            if (!a) {
              //redownload sounds
              RNFS.downloadFile({
                fromUrl:
                  "https://www.soundboard.com/handler/DownLoadTrack.ashx?cliptitle=Superman+Theme&filename=su/Superman%20Theme105937-15b3fb5d-dd04-4e88-8689-44c0091b06ea.mp3",
                toFile: RNFS.CachesDirectoryPath + "/sounds/SupermanTheme.mp3",
              }).promise.then((r) => {
                console.log("loaded", r);
              });
            }
          })
          .catch((err) => {
            console.log("2", err.message);
          });
        break;

      case "Adventure":
        await CheckItem("cache", "sounds/HesaPirate.mp3")
          .then((a) => {
            if (!a) {
              //redownload sounds
              RNFS.downloadFile({
                fromUrl:
                  "http://fr03.mp3pro.xyz/d69937435a7c645e80b24/Pirates%20of%20the%20Caribbean%20-%20He%20s%20a%20Pirate%20%28Extended%29.mp3",
                toFile: RNFS.CachesDirectoryPath + "/sounds/HesaPirate.mp3",
              }).promise.then((r) => {
                console.log("loaded", r);
              });
            }
          })
          .catch((err) => {
            console.log("2", err.message);
          });
        break;

      case "Summer Vibes":
        await CheckItem("cache", "sounds/HeyYa.mp3")
          .then((a) => {
            if (!a) {
              //redownload sounds
              RNFS.downloadFile({
                fromUrl:
                  "http://fr05.mp3pro.xyz/c3d8e9335a7b23e2ca0db/OutKast%20-%20Hey%20Ya%20%28Official%20Music%20Video%29.mp3",
                toFile: RNFS.CachesDirectoryPath + "/sounds/HeyYa.mp3",
              }).promise.then((r) => {
                console.log("loaded", r);
              });
            }
          })
          .catch((err) => {
            console.log("2", err.message);
          });
        break;
    }
  };

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
    resizeMode: "contain",
    paused: false,
    captures: [],
    project_data: {},
    project_name: "",
    mood: "",
    format: "",
    isProcessing: false,
    processFinished: false,
    finishedMediaLink: "",
    processingMediaCount: 0,
    totalMediaCount: 0,
  };

  idOf(i) {
    return (
      (i >= 26 ? idOf(((i / 26) >> 0) - 1) : "") +
      "abcdefghijklmnopqrstuvwxyz"[i % 26 >> 0]
    );
  }

  processMedia = async () => {
    var videoUrls = [];
    var urlToBeDeleted = [];
    var ffmpegVideoInput = [];
    var filterComplex = "";
    var mappingConcat = "";
    this.setState({ isProcessing: true, processFinished: false, totalMediaCount: this.state.captures.length });
    const youtubeRatio = "16/9";
    const instagramRatio = "9/16";
    const instagramDuration = "00:00:15";
    const summerSong = "/sounds/HeyYa.mp3";
    const adventureSong = "/sounds/HesaPirate.mp3";
    const actionSong = "/sounds/SupermanTheme.mp3";
    var presetProcessingSpeed = [];
//    if (Platform.OS === "android") {
    presetProcessingSpeed.push("-preset", "superfast")
//    }
    var chosenSong = "";
    let requests = this.state.captures.map(({ uri, type }, idx) => {

      return new Promise (async (resolve, reject) => {
      if (type === "photo") {
      //if ios, need to move from asset to cache
        if (Platform.OS === "ios"){
           const fileNameLength = uri.length;
           const ext = uri.substring(uri.lastIndexOf("=")+1, fileNameLength);
           console.log(uri, RNFS.TemporaryDirectoryPath + idx + "_raw." + "JPG")
           await RNFS.copyAssetsFileIOS(
                uri,
                RNFS.TemporaryDirectoryPath + idx + "_raw." + "JPG",
                0,
                0
            ).then((a) => {
                uri = RNFS.TemporaryDirectoryPath + idx + "_raw." + "JPG"
            });
        }

        console.log(uri)
        var finalUri =
          uri.substring(0, uri.lastIndexOf(".")) + "_converted.mp4";
        await RNFFmpeg.executeWithArguments([
          "-f",
          "image2",
          "-loop",
          "1",
          "-framerate",
          "20",
          "-i",
          uri,
          "-c:v",
          "libx264",
          "-y",
          "-vf",
          "format=yuv420p,scale=360:360,pad=ceil(iw/2)*2:ceil(ih/2)*2",
          ...presetProcessingSpeed,
          "-t",
          "00:00:02",
          finalUri,
        ]).then((result) => {
          var ratio =
            this.state.format === "Instagram Story"
              ? instagramRatio
              : youtubeRatio;
          var speedRate = "";
          switch (this.state.mood) {
            case "Summer Vibes":
              speedRate = "2";
              chosenSong = summerSong;
              break;
            case "Adventure":
              speedRate = "0.5";
              chosenSong = adventureSong;
              break;
            case "Action":
              speedRate = "0.25";
              chosenSong = actionSong;
              break;
            default:
              speedRate = "1";
              chosenSong = summerSong;
              break;
          }

          if (result.rc === 0) {
            videoUrls.push(finalUri);
            urlToBeDeleted.push(finalUri);
            ffmpegVideoInput.push("-t", "2", "-i", finalUri);
            filterComplex =
              filterComplex +
              "[" +
              (videoUrls.length - 1) +
              "]scale=640x640,setdar=" +
              ratio +
              ",setpts=" +
              speedRate +
              "*PTS[" +
              this.idOf(idx) +
              "];";
      this.setState({processingMediaCount: this.state.processingMediaCount + 1});
      resolve();
          }
        })
      } else {
      //if ios, need to move from asset to cache
        if (Platform.OS === "ios"){
              const fileNameLength = uri.length;
              const ext = uri.substring(uri.lastIndexOf("."), fileNameLength);
            await RNFS.copyAssetsVideoIOS(
                uri,
                RNFS.CachesDirectoryPath + "/" + idx + "_raw." + "MOV",
                0,
                0
            ).then((a) => {
                    uri = RNFS.CachesDirectoryPath + "/" + idx + "_raw" + "MOV"
              })
              .catch((err) => {
                console.log(err.message);
              });
        }
        var ratio =
          this.state.format === "Instagram Story"
            ? instagramRatio
            : youtubeRatio;
        var speedRate = "";
        switch (this.state.mood) {
          case "Summer Vibes":
            speedRate = "2";
            break;
          case "Adventure":
            speedRate = "0.5";
            break;
          case "Action":
            speedRate = "0.25";
            break;
          default:
            speedRate = "1";
            break;
        }
        videoUrls.push(uri);
        ffmpegVideoInput.push("-i", uri);
        filterComplex =
          filterComplex +
          "[" +
          (videoUrls.length - 1) +
          "]scale=640x640,setdar=" +
          ratio +
          ",setpts=" +
          speedRate +
          "*PTS[" +
          this.idOf(idx) +
          "];";
      this.setState({processingMediaCount: this.state.processingMediaCount + 1});
      resolve();
      }
    })})

    await Promise.all(requests).then(() => {
      for (let i = 0; i < videoUrls.length; i++) {
        mappingConcat = mappingConcat + "[" + this.idOf(i) + "]";
      }
      filterComplex =
        filterComplex +
        mappingConcat +
        "concat=n=" +
        videoUrls.length +
        ":v=1:a=0";
      if (videoUrls.length > 1) {
        var instagramDurationArray = [];
        if (this.state.format === "Instagram Story") {
          instagramDurationArray.push("-t", instagramDuration);
        }
        RNFFmpeg.executeWithArguments([
          ...ffmpegVideoInput,
          "-i",
          "file://" + RNFS.CachesDirectoryPath + chosenSong,
          "-filter_complex",
          filterComplex,
          "-map",
          videoUrls.length + ":a",
          "-vsync",
          "2",
          ...presetProcessingSpeed,
          "-shortest",
          "-y",
          ...instagramDurationArray,
          "file://" + RNFS.CachesDirectoryPath + "/exported/" +
            this.state.project_name +
            ".mp4",
        ]).then((result) => {
          if (result.rc === 0) {
            CameraRoll.save(
              "file://" + RNFS.CachesDirectoryPath + "/exported/" +
                this.state.project_name +
                ".mp4",
              {
                type: "video",
                album: "CoVid20 Exported",
              }
            )
              .then((result) => {
              RNFS.exists("file://" + RNFS.CachesDirectoryPath + "/exported/" +
                                          this.state.project_name +
                                          ".mp4")
                                  .then(() => {
                                    if ("file://" + RNFS.CachesDirectoryPath + "/exported/" +
                                                        this.state.project_name +
                                                        ".mp4") {
                                      return (
                                        RNFS.unlink("file://" + RNFS.CachesDirectoryPath + "/exported/" +
                                                                    this.state.project_name +
                                                                    ".mp4")
                                          .then(() => {
                                          })
                                          // `unlink` will throw an error, if the item to unlink does not exist
                                          .catch((err) => {
                                            console.log(err.message);
                                          })
                                      );
                                    }
                                  })
                                  .catch((err) => {
                                    console.log(err.message);
                                  });
                this.setState({
                  isProcessing: false,
                  processFinished: true,
                  finishedMediaLink: result,
                  processingMediaCount: 0,
                  totalMediaCount: videoUrls.length,
                });
    //delete converted image video
    urlToBeDeleted.map((uri) => {
        RNFS.exists(uri)
                    .then(() => {
                      if (uri) {
                        return (
                          RNFS.unlink(uri)
                            .then(() => {
                            })
                            // `unlink` will throw an error, if the item to unlink does not exist
                            .catch((err) => {
                              console.log(err.message);
                            })
                        );
                      }
                    })
                    .catch((err) => {
                      console.log(err.message);
                    });
        });
              })
              .catch((err) => console.log("err:", err));
          }
        });
      } else {
        console.log("Select at least 2 videos");
      }
    });


  };

  navigateToViewExported = (props) => {
    this.props.navigation.navigate({
      type: "Navigate",
      routeName: "ViewExportedProjectScreen_Stack",
      params: { ...this.props.navigation.state.params },
    });
  };

  render() {
   console.log()
    var finishedUri = this.state.finishedMediaLink + "";
      if (finishedUri.includes("ph://")) {
          const appleId = finishedUri.substring(5, 41);
          finishedUri = "assets-library://asset/asset."+"mp4"+"?id="+appleId+"&ext="+"mp4";
      }


     var fontFamily = ""
     var fontFamilyLight = ""
     if (Platform.OS === "ios") {
        fontFamily = "AppleSDGothicNeo-Bold"
        fontFamilyLight = "AppleSDGothicNeo-Light"
     }else{

      fontFamily = "sans-serif"
      fontFamilyLight = "sans-serif-light"
     }
    return (
      <React.Fragment>
        <View style={{flexGrow: 1}}>
        <View style={{ alignItems: "center", top: heightRatio*80}}>

        {this.state.processFinished &&
          <View style={{ alignItems: "center" }}>
            <Text style={{ fontSize: 20, alignItems: "center", bottom: heightRatio*60, fontFamily: fontFamily }}>
              {" "}
              Project: {this.state.project_name}{" "}
            </Text>
          </View>}

        {!this.state.processFinished &&
          <View style={{ alignItems: "center"}}>
            <Text style={{ fontSize: 20, alignItems: "center", bottom: heightRatio*50, fontFamily: fontFamily}}>
              {" "}
              Project: {this.state.project_name}{" "}
            </Text>
            <Text style={{ fontSize: 20, alignItems: "center", bottom: heightRatio*30, fontFamily: fontFamilyLight }}>
              {" "}
              Sequence length: {this.state.captures.length} media{" "}
            </Text>
            <Text style={{ fontSize: 20, alignItems: "center", bottom: heightRatio*30, fontFamily: fontFamilyLight }}> Mood: {this.state.mood} </Text>
            <Text style={{ fontSize: 20, alignItems: "center", bottom: heightRatio*30, fontFamily: fontFamilyLight }}> Format: {this.state.format} </Text>
          </View>}

          {!this.state.isProcessing && !this.state.processFinished && (
            <View style={{ alignItems: "center", bottom: heightRatio*-80 }}>
              <TouchableOpacity
                style={styles.addToSequenceButton}
                onPress={() => this.processMedia()}
              >
                <Text style={styles.buttonText}> Process My Video </Text>
              </TouchableOpacity>
            </View>
          )}

          {this.state.isProcessing && !this.state.processFinished && (
            <View style={{ alignItems: "center", bottom: heightRatio*-80 }}>
              <ActivityIndicator size="large" color="#0000ff" />

              { this.state.processingMediaCount === 0 &&
                  <Text style={{ alignItems: "center", bottom: heightRatio*-90 }}>
                        Processed media: {this.state.processingMediaCount} of {this.state.totalMediaCount}
                  </Text>
              }

              { this.state.processingMediaCount > 0 && this.state.processingMediaCount !== this.state.totalMediaCount &&
                  <Text style={{ alignItems: "center", bottom: heightRatio*-90 }}>
                        Processed media: {this.state.processingMediaCount} of {this.state.totalMediaCount}
                  </Text>
              }

              { this.state.processingMediaCount > 0 && this.state.processingMediaCount === this.state.totalMediaCount &&
                  <Text style={{ alignItems: "center", bottom: heightRatio*-90 }}>
                        Processing final media...
                  </Text>
              }
            </View>
          )}

          {this.state.finishedMediaLink !== "" &&
            !this.state.isProcessing &&
            this.state.processFinished && (
              <View style={styles.containerResult}>
                <Video
                  source={{ uri: finishedUri }}
                  style={styles.fullScreenResult}
                  paused={this.state.paused}
                  resizeMode={this.state.resizeMode}
                  onLoad={() => {
                    this.player.seek(1);
                  }}
                  repeat={true}
                  ref={(ref) => (this.player = ref)}
                />
              </View>
            )}

            {this.state.processFinished &&
              <View style={{ alignItems: "center" }}>
                <Text style={{ fontSize: 20, alignItems: "center", bottom: heightRatio*0, fontFamily: fontFamilyLight }}>
                  {" "}
                  Sequence length: {this.state.captures.length} media{" "}
                </Text>
                <Text style={{ fontSize: 20, alignItems: "center", bottom: heightRatio*0, fontFamily: fontFamilyLight }}> Mood: {this.state.mood} </Text>
                <Text style={{ fontSize: 20, alignItems: "center", bottom: heightRatio*0, fontFamily: fontFamilyLight }}> Format: {this.state.format} </Text>
              </View>}
        </View>
                  {this.state.processFinished && (
                    <View
                      style={{
                        alignItems: "center",
                        position: "absolute",
                        width: winWidth,
                        bottom: 0,
                      }}
                    >
                      <TouchableOpacity
                        style={styles.addToSequenceButton}
                        onPress={this.navigateToViewExported}
                      >
                        <Text style={styles.buttonText}> View Exported Projects </Text>
                      </TouchableOpacity>
                    </View>
                  )}
        </View>
      </React.Fragment>
    );
  }
}
