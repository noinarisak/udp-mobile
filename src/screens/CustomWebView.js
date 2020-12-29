
import React, { memo } from 'react';
import { View, Dimensions } from 'react-native'
import { WebView } from 'react-native-webview';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Button from '../components/Button';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const CustomWebView = ({ route, navigation }) => {
  const { uri, accessToken } = route.params;
  
  onLoad = async(state) => {
    console.log('----', state.url);
    if(state.url.indexOf('/authorize/callback#access_token') >= 0) {
      let regex = /[?#]([^=#]+)=([^&#]*)/g;
      let params = {};
      while ((match = regex.exec(state.url))) {
        params[match[1]] = match[2]
      }
      
      await AsyncStorage.setItem('@hasConsent', "phone");
      await navigation.goBack(null);
    } else if(state.url.indexOf('/authorize/callback#state') >= 0) {
      await AsyncStorage.removeItem('@hasConsent');
      await navigation.goBack(null);
    }
  }

  return (
    <View style={{
      height: height - 55,
      position: 'absolute',
      width,
      bottom: 0,
      borderTopLeftRadius: 10,
      borderTopRightRadius: 10,
      backgroundColor: 'white',
    }}>
      <Button
        onPress={() => navigation.goBack(null)}
        style={{
          flexDirection: 'row',
          justifyContent: 'flex-end',
        }}
      >
        Close
      </Button>
      <WebView
        source={{ uri }}
        onNavigationStateChange={onLoad}
        incognito={!accessToken}
      />
    </View>
  );
};

const Stack = createStackNavigator();

export default function WebViewStack({ route, navigation }) {
  const { accessToken, uri } = route.params;
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false, cardStyle: { backgroundColor: 'transparent' }}}
      mode="modal"
    >
      <Stack.Screen name="Modal" component ={memo(CustomWebView)} initialParams={{ uri, accessToken }} />
    </Stack.Navigator>
  )
}
