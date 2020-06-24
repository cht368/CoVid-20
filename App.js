// App.js file
import React from 'react';
import {Dimensions} from 'react-native';

import {SwitchNavigator} from './src/SideNavigator';
import { createAppContainer } from 'react-navigation';
import EStyleSheet from 'react-native-extended-stylesheet';

let {height, width} = Dimensions.get('window');
EStyleSheet.build({
    $rem: width / 411,
});

const App = createAppContainer(SwitchNavigator);

export default App;