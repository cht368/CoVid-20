import React from 'react';
import { View, Image, ScrollView, TouchableOpacity, Platform } from 'react-native';
import Video from "react-native-video";
import styles from './styles';

export default ({captures=[]}) => (
    <ScrollView
        horizontal={true}
        style={[styles.bottomToolbar, styles.galleryContainer]}
    >
        {captures.map(({ uri, type, thumbnail }) => (
            type === 'photo' || Platform.OS === 'android' ?
            <View style={styles.galleryImageContainer} key={uri}>
                <Image source={{ uri }} style={styles.galleryImage} />
            </View>
            :
            <View style={styles.galleryImageContainer} key={uri}>
                <Image source={{ uri: thumbnail }} style={styles.galleryImage} />
            </View>
        ))}
    </ScrollView>
);