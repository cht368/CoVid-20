import React from 'react';
import { RNCamera } from 'react-native-camera';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { Col, Row, Grid } from "react-native-easy-grid";
import {View, TouchableWithoutFeedback, TouchableOpacity} from 'react-native';
import styles from './styles';

export default ({
    capturing = false,
    cameraType = RNCamera.Constants.Type.back,
    flashMode = RNCamera.Constants.FlashMode.off,
    setFlashMode, setCameraType,
    onCaptureIn, onCaptureOut, onLongCapture, onShortCapture,
    toggleDrawer, navigateToExport
}) => (
    <Grid style={styles.bottomToolbar}>
        <Row>
            <Col style={styles.alignCenter}>
                <TouchableOpacity onPress={() => toggleDrawer()}>
                    <Ionicons
                        name="md-menu"
                        color="white"
                        size={30}
                    />
                </TouchableOpacity>
            </Col>
            <Col size={2} style={styles.alignCenter}>
                <TouchableOpacity onPress={() => navigateToExport()}>
                    <AntDesign
                        name="upload"
                        color="white"
                        size={30}
                    />
                </TouchableOpacity>
            </Col>
            <Col style={styles.alignCenter}>
                <TouchableOpacity onPress={() => setCameraType(
                    cameraType === RNCamera.Constants.Type.back ? RNCamera.Constants.Type.front : RNCamera.Constants.Type.back
                )}>
                    <Ionicons
                        name="md-reverse-camera"
                        color="white"
                        size={30}
                    />
                </TouchableOpacity>
            </Col>
        </Row>
    </Grid>
);