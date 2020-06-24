import { StyleSheet, Dimensions } from "react-native";
import EStyleSheet from 'react-native-extended-stylesheet';
import {widthRatio, heightRatio} from "../../HelpStrings"

const { width: winWidth, height: winHeight } = Dimensions.get("window");

export default EStyleSheet.create({
  preview: {
    height: winHeight,
    width: winWidth,
    position: "absolute",
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
  },
  alignCenter: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  galleryContainer: {
    borderWidth: 1,
    borderColor: "grey",
    height: heightRatio*120,
  },
  galleryImageContainer: {
    width: widthRatio*35,
    height: widthRatio*70,
    marginRight: 5,
    borderWidth: 0.5,
    borderColor: "black",
  },
  galleryImage: {
    width: widthRatio*35,
    height: widthRatio*70,
    tintColor: "gray",
  },
  selectedGalleryImageContainer: {
    width: widthRatio*70,
    height: widthRatio*70,
    marginRight: 5,
    borderWidth: 0.5,
    borderColor: "yellow",
  },
  selectedGalleryImage: {
    width: widthRatio*70,
    height: widthRatio*70,
    borderWidth: 2,
    borderColor: "yellow",
    opacity: 0.3,
  },

  addToSequenceButton: {
    backgroundColor: "#7a42f4",
    padding: 10,
    margin: 10,
    height: heightRatio*70,
    width: (winWidth * 8) / 10,
    alignItems: "center",
  },

  addToSequenceButtonSelected: {
    backgroundColor: "#7a42f4",
    padding: 10,
    margin: 10,
    height: heightRatio*70,
    width: (winWidth * 8) / 10,
    alignItems: "center",
    opacity: 0.5,
  },

  buttonText: {
    color: "white",
  },

  container: {
    justifyContent: "center",
    alignItems: "center",
    top: winWidth * 0.04,
    left: winWidth / 10,
    bottom: winWidth / 10,
    width: (winWidth * 8) / 10,
    height: winHeight * 0.4,
    borderColor: "grey",
    borderWidth: 2,
  },

  fullScreen: {
    position: "absolute",
    width: (winWidth * 8) / 10,
    height: winHeight * 0.4,
  },

  containerResult: {
    justifyContent: "center",
    alignItems: "center",
    top: heightRatio*-25,
    width: (winWidth * 8) / 10,
    height: winHeight * 0.4,
    borderColor: "grey",
    borderWidth: 2,
  },
  fullScreenResult: {
    position: "relative",
    width: (winWidth * 8) / 10,
    height: winHeight * 0.4,
  },
});
