import React from 'react'

import {
  View,
  Text,
  TouchableHighlight,
  Modal,
  StyleSheet,
  Button,
  Image,
  Dimensions,
  ScrollView,
  RefreshControl
} from 'react-native'

import Video, {FilterType} from "react-native-video";
import CameraRoll from "@react-native-community/cameraroll";

import Share from 'react-native-share';
import RNFetchBlob from 'rn-fetch-blob'
import { useIsFocused } from '@react-navigation/native'

import {widthRatio, heightRatio} from "../../HelpStrings"

const { width } = Dimensions.get('window')

class ViewExportedProjectScreen extends React.Component {
  player = [];

  componentDidMount(props) {
    this.getPhotos()
    this.listener = this.props.navigation.addListener("willFocus", this.getPhotos);
  }

    componentWillUnmount() {
      this.listener.remove();
    }

  state = {
    modalVisible: false,
    photos: [],
    index: null
  }

  setIndex = (index) => {
    if (index === this.state.index) {
      index = null
    }
    this.setState({ index })
  }

  getPhotos = () => {
    CameraRoll.getPhotos({
      first: 50,
      assetType: 'All',
      groupName: "CoVid20 Exported",
    })
    .then(r => this.setState({ photos: r.edges }))
  }

  toggleModal = () => {
    this.setState({ modalVisible: !this.state.modalVisible });
  }

  share = () => {
    const image = this.state.photos[this.state.index].node.image.uri
      var finalUrl =  image;
      let shareOptions = {
        title: "Share This Project",
        message: "Check this out!",
        url: finalUrl,
        type: this.state.photos[this.state.index].node.type,
      };

      Share.open(shareOptions)
        .then((res) => console.log('res:', res))
        .catch(err => console.log('err', err))
  }

  render() {
    return (
      <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollView}>
              {
                this.state.photos.map((p, i) => {
                    if (p.node.type.includes('video')) {

                      var finalVideoUri = p.node.image.uri
                      if (finalVideoUri.includes("ph://")) {
                          const appleId = p.node.image.uri.substring(5, 41);
                          const fileNameLength = p.node.image.filename.length;
                          const ext = p.node.image.filename.substring(fileNameLength - 3);
                          finalVideoUri = "assets-library://asset/asset."+ext+"?id="+appleId+"&ext="+ext;
                      }

                      return (
                        <TouchableHighlight
                          style={{opacity: i === this.state.index ? 0.5 : 1}}
                          key={i}
                          underlayColor='transparent'
                          onPress={() => this.setIndex(i)}
                        >
                          <View style={{
                             width: width/3,
                             height: width/3,
                           }}>
                          <Video
                              source={{uri: finalVideoUri}}
                              style={{
                                 width: width/3,
                                 height: width/3,
                               }}
                              paused={i === this.state.index ? false : true}
                              muted={true}
                              resizeMode='contain'
                              ref={(ref)=>{this.player[i]=ref}}
                              onLoad={()=>{this.player[i].seek(1)}}
                              repeat={true}
                            />
                            </View>
                        </TouchableHighlight>
                      )

                    } else {
                  return (
                    <TouchableHighlight
                      style={{opacity: i === this.state.index ? 0.5 : 1}}
                      key={i}
                      underlayColor='transparent'
                      onPress={() => this.setIndex(i)}
                    >
                        <Image
                          style={{
                            width: width/3,
                            height: width/3
                          }}
                          source={{uri: p.node.image.uri}}
                          resizeMode='contain'
                        />

                    </TouchableHighlight>
                  )
                  }
                })
              }
            </ScrollView>
            {
              this.state.index !== null  && (
                <View style={styles.shareButton}>
                  <Button
                      title='Share'
                      onPress={this.share}
                    />
                </View>
              )
            }
      </View>
    )
  }
}

let styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalContainer: {
    paddingTop: heightRatio*40,
    flex: 1
  },
  scrollView: {
    flexWrap: 'wrap',
    flexDirection: 'row'
  },
  shareButton: {
    position: 'absolute',
    width,
    padding: 10,
    bottom: 0,
    left: 0
  }
})

export default ViewExportedProjectScreen