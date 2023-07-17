import React from "react";
import { WebView, WebViewMessageEvent } from "react-native-webview";
import { StackActions } from "@react-navigation/native";

export default function WebviewContainer({ navigation, route }) {
  const targetUrl = "http://192.168.0.101:3000";
  const url = route.params?.url ?? targetUrl;

  const requestOnMessage = async (e: WebViewMessageEvent): Promise<void> => {
    const nativeEvent = JSON.parse(e.nativeEvent.data);
    if (nativeEvent?.type === "ROUTER_EVENT") {
      const path: string = nativeEvent.data;
      if (path === "back") {
        const popAction = StackActions.pop(1);
        navigation.dispatch(popAction);
      } else {
        const pushAction = StackActions.push("Details", {
          url: `${targetUrl}${path}`,
          isStack: true,
        });
        navigation.dispatch(pushAction);
      }
    }
  };

  return (
    <WebView
      originWhitelist={["*"]}
      source={{ uri: url }}
      onMessage={requestOnMessage}
    />
  );
}
