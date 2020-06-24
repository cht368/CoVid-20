import { StyleSheet, Dimensions } from 'react-native';

import EStyleSheet from 'react-native-extended-stylesheet';
import {widthRatio, heightRatio} from "../../HelpStrings"

const { width: winWidth, height: winHeight } = Dimensions.get('window');

export default EStyleSheet.create({
    preview: {
        height: winHeight,
        width: winWidth,
        position: 'absolute',
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
    },
    alignCenter: {
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
        },
        bottomToolbar: {
            width: winWidth,
            position: 'absolute',
            height: heightRatio*200,
            bottom: 0,
        },
        captureBtn: {
            width: widthRatio*60,
            height: widthRatio**60,
            borderWidth: 2,
            borderRadius: widthRatio*60,
            borderColor: "#FFFFFF",
        },
        captureBtn2: {
            width: winWidth,
            height: winHeight,
        },
        captureBtnActive: {
            width: widthRatio*80,
            height: widthRatio*80,
        },
        captureBtnInternal: {
            width: widthRatio*76,
            height: widthRatio*76,
            borderWidth: 2,
            borderRadius: widthRatio*76,
            backgroundColor: "red",
            borderColor: "transparent",
        },
        galleryContainer: {
                bottom: heightRatio*120
            },
            galleryImageContainer: {
                width: widthRatio*80,
                height: widthRatio*80,
                marginRight: 5
            },
            galleryImage: {
                width: widthRatio*80,
                height: widthRatio*80
            },
});