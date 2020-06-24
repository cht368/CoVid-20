// src/camera.page.js file
import React from "react";
import {
  Dimensions,
  View,
  Text,
  Platform,
  PanResponder,
  TouchableWithoutFeedback,
} from "react-native";
import AsyncStorage from '@react-native-community/async-storage';
import { RNCamera } from "react-native-camera";
import {
  checkMultiple,
  requestMultiple,
  PERMISSIONS,
  RESULTS,
} from "react-native-permissions";
import RNRestart from "react-native-restart";

import { createThumbnail } from "react-native-create-thumbnail";
import RNConvertPhAsset from "react-native-convert-ph-asset";

import CameraRoll from "@react-native-community/cameraroll";
import RNFS from "react-native-fs";

import {SetItem, GetItem, CheckItem} from "../../storage_management/Storage"

import Toolbar from "./toolbar.component";
import Gallery from "./gallery.component";
import styles from "./styles";

export default class CameraPage extends React.Component {
  camera = null;

  state = {
    captures: [],
    capturing: false,
    hasCameraPermission: null,
    cameraType: RNCamera.Constants.Type.back,
    flashMode: RNCamera.Constants.FlashMode.off,
    cameraZoom: 0,
    mediaType: "picture",
    zoomAdjusted: false,
    project_name: "",
  };

    constructor(props) {
      super(props);
      this.loadThings();
      this.listener = this.props.navigation.addListener(
        "willFocus",
        this.loadThings
      );
    }

  setFlashMode = (flashMode) => this.setState({ flashMode });
  setCameraType = (cameraType) => this.setState({ cameraType });

  handleCaptureIn = () => {
    if (this.state.capturing)
      if (this.state.mediaType === "video") {
        this.camera.stopRecording();
      }
    this.setState({ capturing: true, zoomAdjusted: false });
    this.long_press_timeout = setTimeout(() => {
      //if this accessed means user do a long press, start recording video
      this.setState({ mediaType: "video" });
      this.handleLongCapture();
    }, 1000);
  };

  handleCaptureOut = async () => {
    setTimeout(() => {
      clearTimeout(this.long_press_timeout);
      if (this.state.capturing && !this.state.zoomAdjusted)
        if (this.state.mediaType === "video") {
          this.camera.stopRecording();
        }
    }, 1000);
  };

  handleShortCapture = async () => {
    clearTimeout(this.long_press_timeout);
    try {
      const photoData = await this.camera.takePictureAsync();
      console.log(photoData.uri)
      CameraRoll.save(photoData.uri, {
        type: "photo",
        album: "CoVid20 Captured",
      })
        .then((result) => {
          RNFS.exists(photoData.uri)
            .then(() => {
              if (photoData.uri) {
                return (
                  RNFS.unlink(photoData.uri)
                    .then(() => {
                      photoData.uri = result;
                      photoData.type = "photo";
                      this.setState({
                        captures: [photoData, ...this.state.captures],
                      });
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
        })
        .catch((err) => console.log("err:", err));
    } catch (err) {
      console.log(err);
    }
    this.setState({ capturing: false, mediaType: "picture" });
  };

  handleLongCapture = async () => {
    try {
      const videoData = await this.camera.recordAsync();
      CameraRoll.save(videoData.uri, {
        type: "video",
        album: "CoVid20 Captured",
      })
        .then((result) => {
          RNFS.exists(videoData.uri)
            .then(() => {
              if (videoData.uri) {
                return (
                  RNFS.unlink(videoData.uri)
                    .then(() => {
                      videoData.uri = result;
                      videoData.type = "video";
                      if (Platform.OS === "ios") {
                        RNConvertPhAsset.convertVideoFromUrl({
                          url: videoData.uri,
                          convertTo: "mov",
                          quality: "original",
                        })
                          .then((responseVideo) => {
                            createThumbnail({
                              url: responseVideo.path,
                            })
                              .then((response) => {
                                videoData.thumbnail = "file://" + response.path;
                                this.setState({
                                  captures: [videoData, ...this.state.captures],
                                });
                              })
                              .catch((err) => console.log({ err }));
                          })
                          .catch((err) => {
                            console.log(err);
                          });
                      } else {
                        this.setState({
                          captures: [videoData, ...this.state.captures],
                        });
                      }
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
        })
        .catch((err) => console.log("err:", err));
    } catch (err) {
      console.log(err);
    }
    this.setState({ capturing: false, mediaType: "picture" });
  };

  handleStartShouldSetPanResponder = () => {
    if (this.state.capturing)
      if (this.state.mediaType === "video") {
        this.camera.stopRecording();
      }
    this.setState({ capturing: true });
    return true;
  };

  handlePanResponderGrant(e, gestureState) {
    //        console.log('Start of touch');
    //        this.setState({ capturing: true });
    //        this.long_press_timeout = setTimeout(() => {
    //                console.log("video recording...")
    //                //if this accessed means user do a long press, start recording video
    //                this.setState({ mediaType: "video" });
    //                this.handleLongCapture();
    //            },
    //        1);
  }

  onZoomProgress = (progress) => {
    if (Platform.OS === "ios") {
      progress = progress * 0.04;
    }
    this.setState({ cameraZoom: progress, zoomAdjusted: true });
  };

  onZoomEnd = () => {
    clearTimeout(this.long_press_timeout);
    if (this.state.capturing) {
      if (this.state.mediaType === "video") {
        this.camera.stopRecording();
      }

      if (this.state.mediaType === "picture") {
        this.handleShortCapture();
      }
    }
    this.setState({ capturing: false, cameraZoom: 0, zoomAdjusted: false });
  };

  toggleDrawer = (props) => {
    //Props to open/close the drawer
    this.props.navigation.toggleDrawer();
  };

  navigateToExport = (props) => {
    this.props.navigation.navigate({
        type: "Navigate",
        routeName: "ExportScreen_Stack",
        params: {...this.props.navigation.state.params, title: this.state.project_name}
    });
  };

  loadThings = () =>  {
    //check permissions
    var cameraCondition = "";
    var audioCondition = "";
    var writeStorage = "";
    var readStorage = "";
    var camera = "";
    var audio = "";
    var readStatus = "";
    var writeStatus = "";
    Platform.OS === "ios"
      ? (cameraCondition = PERMISSIONS.IOS.CAMERA)
      : (cameraCondition = PERMISSIONS.ANDROID.CAMERA);
    Platform.OS === "ios"
      ? (audioCondition = PERMISSIONS.IOS.MICROPHONE)
      : (audioCondition = PERMISSIONS.ANDROID.RECORD_AUDIO);
    Platform.OS === "ios"
      ? (writeStorage = PERMISSIONS.IOS.MEDIA_LIBRARY)
      : (writeStorage = PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE);
    Platform.OS === "ios"
      ? (readStorage = PERMISSIONS.IOS.PHOTO_LIBRARY)
      : (readStorage = PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE);

    checkMultiple([
      cameraCondition,
      audioCondition,
      writeStorage,
      readStorage,
    ]).then((result) => {
      var toRequested = [];
      var isCameraNeedRequest = false;
      var isAudioNeedRequest = false;
      var isReadStorageNeedRequest = false;
      var isWriteStorageNeedRequest = false;
      if (
        result[cameraCondition] === "denied" ||
        result[cameraCondition] === "blocked"
      ) {
        isCameraNeedRequest = true;
        toRequested.push(cameraCondition);
      } else {
        camera = result[cameraCondition];
      }

      if (
        result[audioCondition] === "denied" ||
        result[audioCondition] === "blocked"
      ) {
        isAudioNeedRequest = true;
        toRequested.push(audioCondition);
      } else {
        audio = result[audioCondition];
      }

      if (
        result[readStorage] === "denied" ||
        result[readStorage] === "blocked"
      ) {
        isReadStorageNeedRequest = true;
        toRequested.push(readStorage);
      } else {
        readStatus = result[readStorage];
      }

      if (
        result[writeStorage] === "denied" ||
        result[writeStorage] === "blocked"
      ) {
        isWriteStorageNeedRequest = true;
        toRequested.push(writeStorage);
      } else {
        writeStatus = result[writeStorage];
      }

      if (toRequested.length > 0) {
        try {
          requestMultiple(toRequested).then((result) => {
            if (isCameraNeedRequest) {
              camera = result[cameraCondition];
            }
            if (isAudioNeedRequest) {
              audio = result[audioCondition];
            }
            if (isReadStorageNeedRequest) {
              readStatus = result[readStorage];
            }
            if (isWriteStorageNeedRequest) {
              writeStatus = result[writeStorage];
            }

            if (Platform.OS === "ios") {
              var hasCameraPermission =
                camera === "granted" &&
                audio === "granted" &&
                readStatus === "granted" &&
                writeStatus === "granted";
              if (hasCameraPermission) {
                RNRestart.Restart();
              }
            } else {
              RNRestart.Restart();
            }
          });
        } catch (err) {
          console.log(err);
        }
      }
      var hasCameraPermission = camera === "granted" && audio === "granted";
      this.setState({ hasCameraPermission });

        SetItem(
          "cache",
          "sounds_list.txt",
          "sounds",
          "init"
        );
        SetItem(
          "cache",
          "exported_list.txt",
          "exported",
          "init"
        );

      //load mp3s
                CheckItem("cache", "sounds/SupermanTheme.mp3")
                  .then((a) => {
                    if (!a) {
                      //redownload sounds
                    var source = "sounds/SupermanTheme.mp3"
                    var dest = RNFS.CachesDirectoryPath + "/sounds/SupermanTheme.mp3";
                    if (Platform.OS == 'ios') {
                      source = RNFS.MainBundlePath + "/SupermanTheme.mp3"
                      RNFS.copyFile(source, dest)
                        .then((res) => {
                        })
                        .catch((err) => {
                          console.log(err);
                        });
                    } else {
                        RNFS.copyFileAssets(source, dest)
                        .then((res) => {
                        })
                        .catch((err) => {
                          console.log(err);
                        });
                    }
                    }
                  })
                  .catch((err) => {
                    console.log("2", err.message);
                  });

                CheckItem("cache", "sounds/HesaPirate.mp3")
                  .then((a) => {
                    if (!a) {
                      //redownload sounds
                      var source = "sounds/HesaPirate.mp3"
                      var dest = RNFS.CachesDirectoryPath + "/sounds/HesaPirate.mp3";
                      if (Platform.OS == 'ios') {
                        source = RNFS.MainBundlePath + "/HesaPirate.mp3"
                        RNFS.copyFile(source, dest)
                          .then((res) => {
                          })
                          .catch((err) => {
                            console.log(err);
                          });
                      } else {
                          RNFS.copyFileAssets(source, dest)
                          .then((res) => {
                          })
                          .catch((err) => {
                            console.log(err);
                          });
                      }
                    }
                  })
                  .catch((err) => {
                    console.log("2", err.message);
                  });

                CheckItem("cache", "sounds/HeyYa.mp3")
                  .then((a) => {
                    if (!a) {
                      //redownload sounds
                       var source = "sounds/HeyYa.mp3"
                       var dest = RNFS.CachesDirectoryPath + "/sounds/HeyYa.mp3";
                       if (Platform.OS == 'ios') {
                         source = RNFS.MainBundlePath + "/HeyYa.mp3"
                         RNFS.copyFile(source, dest)
                           .then((res) => {
                           })
                           .catch((err) => {
                             console.log(err);
                           });
                       } else {
                           RNFS.copyFileAssets(source, dest)
                           .then((res) => {
                           })
                           .catch((err) => {
                             console.log(err);
                           });
                       }
                    }
                  })
                  .catch((err) => {
                    console.log("2", err.message);
                  });

    });

    this._panResponder = PanResponder.create({
      //start touch
      onStartShouldSetPanResponder: (evt, gestureState) => {
        return this.handleStartShouldSetPanResponder(evt, gestureState);
      },

      //on drag move, adjust zoom
      onPanResponderMove: (evt, { dy }) => {
        const { height: windowHeight } = Dimensions.get("window");
        return this.onZoomProgress(
          Math.min(Math.max((dy * -1) / windowHeight, 0), 1)
        );
      },

      onMoveShouldSetPanResponder: (evt, gestureState) => {
        return true;
      },

      onPanResponderGrant: () => {
        return this.handlePanResponderGrant();
      },

      //user remove touches, stop recording
      onPanResponderRelease: () => {
        return this.onZoomEnd();
      },
    });

//    console.log("init project data")
    var latest_project = "";
    var project_data = {};

    GetItem("document", "latest_state.txt").then((a) => {
        if (a && a.latest_project){
        //latest project exists
                var latest_project = a.latest_project
                // load latest project
                GetItem("document", "Project/"+latest_project+".txt").then((latest_projectData) => {
                    if (latest_projectData){
                        // assign latest project data
                        project_data = latest_projectData;
                    }
                    this.setState({project_name: latest_project})
     try {
        AsyncStorage.setItem('project_name', latest_project);
        AsyncStorage.setItem('project_data', JSON.stringify(project_data));
     } catch (err) {
        console.warn(err);
     }
                }).catch((err) => {
                  console.log(err.message);
                })
        } else {
        //latest project not exists
        }

    }).catch((err) => {
      console.log(err.message);
    })

  }

  render() {
    var {
      hasCameraPermission,
      flashMode,
      cameraType,
      capturing,
      captures,
    } = this.state;
    if (hasCameraPermission === null) {
      return <View />;
    } else if (hasCameraPermission === false) {
      return <Text>Access to camera / camera roll has been denied.</Text>;
    }

    return (
      <React.Fragment>
        <View>
          <RNCamera
            type={cameraType}
            flashMode={flashMode}
            style={styles.preview}
            ref={(camera) => (this.camera = camera)}
            zoom={this.state.cameraZoom}
          />
        </View>
        <View style={[styles.captureBtn2]} {...this._panResponder.panHandlers}>
          <TouchableWithoutFeedback
            onPressIn={this.handleCaptureIn}
            onPressOut={this.handleCaptureOut}
            //onLongPress={this.handleLongCapture}
            onPress={this.handleShortCapture}
          >
            <View style={[styles.captureBtn2]}></View>
          </TouchableWithoutFeedback>
        </View>
        {captures.length > 0 && <Gallery captures={captures} />}
        <Toolbar
          capturing={capturing}
          flashMode={flashMode}
          cameraType={cameraType}
          setFlashMode={this.setFlashMode}
          setCameraType={this.setCameraType}
          onCaptureIn={this.handleCaptureIn}
          onCaptureOut={this.handleCaptureOut}
          onLongCapture={this.handleLongCapture}
          onShortCapture={this.handleShortCapture}
          toggleDrawer={this.toggleDrawer.bind(this)}
          navigateToExport={this.navigateToExport.bind(this)}
        />
      </React.Fragment>
    );
  }
}
