import React, { useEffect, useRef } from "react";
import { BackHandler, Platform } from "react-native";
import { WebView, WebViewMessageEvent } from "react-native-webview";

const App = () => {
  const webViewRef = useRef(null);
  const historyStack = useRef(0);

  const onAndroidBackPress = () => {
    if (webViewRef.current) {
      webViewRef.current.goBack();
      if (historyStack.current === 0) {
        return false;
      }
      historyStack.current =
        historyStack.current === 0 ? 0 : historyStack.current - 1;
      return true;
    }
    return false;
  };

  useEffect(() => {
    if (Platform.OS === "android") {
      BackHandler.addEventListener("hardwareBackPress", onAndroidBackPress);
      return () => {
        BackHandler.removeEventListener(
          "hardwareBackPress",
          onAndroidBackPress
        );
      };
    }
  }, []);

  const requestOnMessage = async (e: WebViewMessageEvent): Promise<void> => {
    const nativeEvent = JSON.parse(e.nativeEvent.data);
    if (nativeEvent?.type === "ROUTER_EVENT") {
      const path: string = nativeEvent.data;
      if (path === "back") {
        onAndroidBackPress();
      } else {
        historyStack.current += 1;
      }
    }
  };

  return (
    <WebView
      source={{ uri: "http://192.168.0.101:3000" }}
      ref={webViewRef}
      onMessage={requestOnMessage}
    />
  );
};
export default App;
