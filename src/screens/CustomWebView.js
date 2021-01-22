import React, { memo, useState } from 'react';
import { View, Dimensions, ActivityIndicator } from 'react-native'
import { WebView } from 'react-native-webview';
import { createStackNavigator } from '@react-navigation/stack';
import Button from '../components/Button';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const CustomWebView = ({ route, navigation }) => {
  const [isLoading, setIsLoading] = useState(true);
  const { uri, onGoBack, incognito } = route.params;

  onLoad = (state) => {
    console.log('state-----', state.url);
    if(state.url.indexOf('/authorize/callback#access_token') >= 0) {
      let regex = /[?#]([^=#]+)=([^&#]*)/g;
      let params = {};
      while ((match = regex.exec(state.url))) {
        params[match[1]] = match[2]
      }
      const { access_token } = params;
      onGoBack(true, access_token);
      navigation.goBack();

    } else if(state.url.indexOf('/authorize/callback#state') >= 0) {
      onGoBack(false);
      navigation.goBack();
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
        onPress={() => navigation.goBack()}
        style={{
          flexDirection: 'row',
          justifyContent: 'flex-end',
        }}
      >
        Close
      </Button>
      {
        isLoading && <ActivityIndicator size="large" />
      }
      <WebView
        onLoad={() => setIsLoading(false)}
        source={{ uri }}
        onNavigationStateChange={onLoad}
        incognito={incognito}
      />
    
    </View>
  );
};

const Stack = createStackNavigator();

export default function WebViewStack({ route, navigation }) {
  const { uri, onGoBack, incognito } = route.params;
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false, cardStyle: { backgroundColor: 'transparent' }}}
      mode="modal"
    >
      <Stack.Screen name="Modal" component ={memo(CustomWebView)} initialParams={{ uri, onGoBack, incognito }} />
    </Stack.Navigator>
  )
}
