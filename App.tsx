import React, { useRef } from "react";
import { WebView, WebViewMessageEvent } from "react-native-webview";
import { useRouter } from "./bridge/useRouter";
import { Linking } from "react-native";
import { useAudio } from "./bridge/useAudio";

const App = () => {
  const webViewRef = useRef<WebView | null>(null);
  const { startRecording, stopRecording } = useAudio(webViewRef);
  const historyStack = useRef(0);
  const { onAndroidBackPress } = useRouter({
    historyStack,
    webViewRef,
  });

  const requestOnMessage = async (e: WebViewMessageEvent): Promise<void> => {
    const nativeEvent = JSON.parse(e.nativeEvent.data);

    //라우팅 처리
    if (nativeEvent?.type === "ROUTER_EVENT") {
      const path: string = nativeEvent.data;
      if (path === "back") {
        onAndroidBackPress();
      } else {
        historyStack.current += 1;
      }
    }

    //권한 요청 처리
    if (nativeEvent?.type === "PERMISSIONS") {
      Linking.openSettings();
    }

    if (nativeEvent?.type === "RECORD_START") {
      startRecording();
    }

    if (nativeEvent?.type === "RECORD_STOP") {
      // const uri = nativeEvent.data.uri;
      stopRecording();
    }
  };

  return (
    <WebView
      source={{ uri: "https://web-sound-link-web.vercel.app" }}
      // source={{ uri: "http://192.168.0.101:3000" }}
      ref={webViewRef}
      onMessage={requestOnMessage}
      allowsBackForwardNavigationGestures
    />
  );
};
export default App;
